import Stripe from "stripe";
import { prisma } from "../lib/prisma.js";
import { awardReferralPaid } from "../routes/rewards.js";

// ============================================================
// LAZY STRIPE INITIALIZATION
// Don't create the Stripe instance at module load time.
// If STRIPE_SECRET_KEY is missing or placeholder, billing
// endpoints return 503 instead of crashing the server.
// ============================================================

let _stripe: Stripe | null = null;

const STRIPE_PLACEHOLDER = "sk_test_placeholder";

function isStripeConfigured(): boolean {
  const key = process.env.STRIPE_SECRET_KEY;
  return !!key && key !== STRIPE_PLACEHOLDER;
}

export function getStripe(): Stripe {
  if (!isStripeConfigured()) {
    throw new BillingNotConfiguredError();
  }

  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-02-25.clover",
    });
  }

  return _stripe;
}

export class BillingNotConfiguredError extends Error {
  constructor() {
    super("Billing not configured. Set STRIPE_SECRET_KEY to enable billing.");
  }
}

// Log warning at import time if Stripe is not configured
if (!isStripeConfigured()) {
  console.warn(
    "[BILLING] STRIPE_SECRET_KEY is not set or is a placeholder. Billing endpoints will return 503.",
  );
}

// Plan definitions
const PLANS = {
  starter: { credits: 500, priceMonthly: 3900 }, // $39
  growth: { credits: 2500, priceMonthly: 14900 }, // $149
  scale: { credits: 10000, priceMonthly: 49900 }, // $499
  enterprise: { credits: 10000, priceMonthly: 149900, unlimited: true }, // $1499
} as const;

type PlanKey = keyof typeof PLANS;

// Credit top-up packs
const TOP_UP_PACKS = {
  pack_100: { credits: 100, price: 1500 }, // $15
  pack_500: { credits: 500, price: 5900 }, // $59
  pack_1500: { credits: 1500, price: 14900 }, // $149
  pack_5000: { credits: 5000, price: 39900 }, // $399
} as const;

type PackKey = keyof typeof TOP_UP_PACKS;

function isPlan(plan: string): plan is PlanKey {
  return plan in PLANS;
}

function isPack(pack: string): pack is PackKey {
  return pack in TOP_UP_PACKS;
}

// Ensure user has a Stripe customer ID
async function ensureCustomer(userId: string, email: string): Promise<string> {
  const stripe = getStripe();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripe_customer_id: true },
  });

  if (user?.stripe_customer_id) return user.stripe_customer_id;

  const customer = await stripe.customers.create({
    email,
    metadata: { user_id: userId },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { stripe_customer_id: customer.id },
  });

  return customer.id;
}

export async function createCheckoutSession(
  userId: string,
  email: string,
  plan: string,
  successUrl: string,
  cancelUrl: string,
): Promise<string> {
  const stripe = getStripe();

  if (!isPlan(plan)) {
    throw new Error(`Invalid plan: ${plan}`);
  }

  const customerId = await ensureCustomer(userId, email);
  const planDef = PLANS[plan];

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [
      {
        price_data: {
          currency: "usd",
          recurring: { interval: "month" },
          product_data: {
            name: `FireYourSMM ${plan.charAt(0).toUpperCase() + plan.slice(1)}`,
            description: `${planDef.credits} credits/month`,
          },
          unit_amount: planDef.priceMonthly,
        },
        quantity: 1,
      },
    ],
    metadata: { user_id: userId, plan },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session.url!;
}

export async function createTopUpSession(
  userId: string,
  email: string,
  pack: string,
  successUrl: string,
  cancelUrl: string,
): Promise<string> {
  const stripe = getStripe();

  if (!isPack(pack)) {
    throw new Error(`Invalid pack: ${pack}`);
  }

  const customerId = await ensureCustomer(userId, email);
  const packDef = TOP_UP_PACKS[pack];

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `FireYourSMM Credit Pack`,
            description: `${packDef.credits} credits`,
          },
          unit_amount: packDef.price,
        },
        quantity: 1,
      },
    ],
    metadata: { user_id: userId, pack, credits: String(packDef.credits) },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session.url!;
}

export async function createPortalSession(
  userId: string,
  email: string,
  returnUrl: string,
): Promise<string> {
  const stripe = getStripe();
  const customerId = await ensureCustomer(userId, email);

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session.url;
}

export async function handleWebhook(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      if (!userId) break;

      if (session.mode === "subscription") {
        // Plan purchase
        const plan = session.metadata?.plan;
        if (plan && isPlan(plan)) {
          const planDef = PLANS[plan];
          await prisma.user.update({
            where: { id: userId },
            data: {
              plan,
              credits_remaining: planDef.credits,
              credits_monthly: planDef.credits,
              credits_reset_at: new Date(),
              stripe_customer_id: session.customer as string,
            },
          });

          // Award referral credits if this is their first subscription
          awardReferralPaid(userId).catch((err) =>
            console.error("[REFERRAL] Failed to award paid credits:", err),
          );
        }
      } else if (session.mode === "payment") {
        // Top-up purchase
        const credits = parseInt(session.metadata?.credits || "0", 10);
        if (credits > 0) {
          await prisma.user.update({
            where: { id: userId },
            data: { credits_remaining: { increment: credits } },
          });
        }
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const user = await prisma.user.findUnique({
        where: { stripe_customer_id: customerId },
      });
      if (!user) break;

      // If subscription cancelled at period end, we'll handle on deletion
      if (subscription.cancel_at_period_end) {
        console.log(`Subscription cancelling at period end for user ${user.id}`);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      await prisma.user.updateMany({
        where: { stripe_customer_id: customerId },
        data: {
          plan: "free",
          credits_remaining: 50,
          credits_monthly: 50,
        },
      });
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      // Only reset on recurring invoices (not first payment)
      if (invoice.billing_reason === "subscription_cycle") {
        const user = await prisma.user.findUnique({
          where: { stripe_customer_id: customerId },
          select: { id: true, plan: true },
        });

        if (user && isPlan(user.plan)) {
          const planDef = PLANS[user.plan];
          await prisma.user.update({
            where: { id: user.id },
            data: {
              credits_remaining: planDef.credits,
              credits_reset_at: new Date(),
            },
          });
        }
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      console.error(`Payment failed for customer ${customerId}`);
      break;
    }
  }
}

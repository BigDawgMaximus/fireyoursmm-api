"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingNotConfiguredError = void 0;
exports.getStripe = getStripe;
exports.createCheckoutSession = createCheckoutSession;
exports.createTopUpSession = createTopUpSession;
exports.createPortalSession = createPortalSession;
exports.handleWebhook = handleWebhook;
const stripe_1 = __importDefault(require("stripe"));
const prisma_js_1 = require("../lib/prisma.js");
const rewards_js_1 = require("../routes/rewards.js");
// ============================================================
// LAZY STRIPE INITIALIZATION
// Don't create the Stripe instance at module load time.
// If STRIPE_SECRET_KEY is missing or placeholder, billing
// endpoints return 503 instead of crashing the server.
// ============================================================
let _stripe = null;
const STRIPE_PLACEHOLDER = "sk_test_placeholder";
function isStripeConfigured() {
    const key = process.env.STRIPE_SECRET_KEY;
    return !!key && key !== STRIPE_PLACEHOLDER;
}
function getStripe() {
    if (!isStripeConfigured()) {
        throw new BillingNotConfiguredError();
    }
    if (!_stripe) {
        _stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
            apiVersion: "2026-02-25.clover",
        });
    }
    return _stripe;
}
class BillingNotConfiguredError extends Error {
    constructor() {
        super("Billing not configured. Set STRIPE_SECRET_KEY to enable billing.");
    }
}
exports.BillingNotConfiguredError = BillingNotConfiguredError;
// Log warning at import time if Stripe is not configured
if (!isStripeConfigured()) {
    console.warn("[BILLING] STRIPE_SECRET_KEY is not set or is a placeholder. Billing endpoints will return 503.");
}
// Plan definitions
const PLANS = {
    starter: { credits: 500, priceMonthly: 3900 }, // $39
    growth: { credits: 2500, priceMonthly: 14900 }, // $149
    scale: { credits: 10000, priceMonthly: 49900 }, // $499
    enterprise: { credits: 10000, priceMonthly: 149900, unlimited: true }, // $1499
};
// Credit top-up packs
const TOP_UP_PACKS = {
    pack_100: { credits: 100, price: 1500 }, // $15
    pack_500: { credits: 500, price: 5900 }, // $59
    pack_1500: { credits: 1500, price: 14900 }, // $149
    pack_5000: { credits: 5000, price: 39900 }, // $399
};
function isPlan(plan) {
    return plan in PLANS;
}
function isPack(pack) {
    return pack in TOP_UP_PACKS;
}
// Ensure user has a Stripe customer ID
async function ensureCustomer(userId, email) {
    const stripe = getStripe();
    const user = await prisma_js_1.prisma.user.findUnique({
        where: { id: userId },
        select: { stripe_customer_id: true },
    });
    if (user?.stripe_customer_id)
        return user.stripe_customer_id;
    const customer = await stripe.customers.create({
        email,
        metadata: { user_id: userId },
    });
    await prisma_js_1.prisma.user.update({
        where: { id: userId },
        data: { stripe_customer_id: customer.id },
    });
    return customer.id;
}
async function createCheckoutSession(userId, email, plan, successUrl, cancelUrl) {
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
    return session.url;
}
async function createTopUpSession(userId, email, pack, successUrl, cancelUrl) {
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
    return session.url;
}
async function createPortalSession(userId, email, returnUrl) {
    const stripe = getStripe();
    const customerId = await ensureCustomer(userId, email);
    const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
    });
    return session.url;
}
async function handleWebhook(event) {
    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object;
            const userId = session.metadata?.user_id;
            if (!userId)
                break;
            if (session.mode === "subscription") {
                // Plan purchase
                const plan = session.metadata?.plan;
                if (plan && isPlan(plan)) {
                    const planDef = PLANS[plan];
                    await prisma_js_1.prisma.user.update({
                        where: { id: userId },
                        data: {
                            plan,
                            credits_remaining: planDef.credits,
                            credits_monthly: planDef.credits,
                            credits_reset_at: new Date(),
                            stripe_customer_id: session.customer,
                        },
                    });
                    // Award referral credits if this is their first subscription
                    (0, rewards_js_1.awardReferralPaid)(userId).catch((err) => console.error("[REFERRAL] Failed to award paid credits:", err));
                }
            }
            else if (session.mode === "payment") {
                // Top-up purchase
                const credits = parseInt(session.metadata?.credits || "0", 10);
                if (credits > 0) {
                    await prisma_js_1.prisma.user.update({
                        where: { id: userId },
                        data: { credits_remaining: { increment: credits } },
                    });
                }
            }
            break;
        }
        case "customer.subscription.updated": {
            const subscription = event.data.object;
            const customerId = subscription.customer;
            const user = await prisma_js_1.prisma.user.findUnique({
                where: { stripe_customer_id: customerId },
            });
            if (!user)
                break;
            // If subscription cancelled at period end, we'll handle on deletion
            if (subscription.cancel_at_period_end) {
                console.log(`Subscription cancelling at period end for user ${user.id}`);
            }
            break;
        }
        case "customer.subscription.deleted": {
            const subscription = event.data.object;
            const customerId = subscription.customer;
            await prisma_js_1.prisma.user.updateMany({
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
            const invoice = event.data.object;
            const customerId = invoice.customer;
            // Only reset on recurring invoices (not first payment)
            if (invoice.billing_reason === "subscription_cycle") {
                const user = await prisma_js_1.prisma.user.findUnique({
                    where: { stripe_customer_id: customerId },
                    select: { id: true, plan: true },
                });
                if (user && isPlan(user.plan)) {
                    const planDef = PLANS[user.plan];
                    await prisma_js_1.prisma.user.update({
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
            const invoice = event.data.object;
            const customerId = invoice.customer;
            console.error(`Payment failed for customer ${customerId}`);
            break;
        }
    }
}
//# sourceMappingURL=billing.js.map
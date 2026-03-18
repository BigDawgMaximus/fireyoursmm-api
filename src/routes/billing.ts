import { Router, type Request, type Response } from "express";
import { requireAuth } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";
import {
  getStripe,
  BillingNotConfiguredError,
  createCheckoutSession,
  createTopUpSession,
  createPortalSession,
  handleWebhook,
} from "../services/billing.js";

export const billingRouter = Router();

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3001";

function handleBillingError(err: unknown, res: Response): void {
  if (err instanceof BillingNotConfiguredError) {
    res.status(503).json({ success: false, error: "Billing not configured" });
    return;
  }
  console.error("Billing error:", err);
  res.status(400).json({ success: false, error: String(err) });
}

// ============================================================
// CHECKOUT - Subscribe to a plan
// ============================================================

billingRouter.post("/checkout", requireAuth, async (req: Request, res: Response) => {
  try {
    const { plan } = req.body;

    if (!plan) {
      res.status(400).json({ success: false, error: "Missing plan" });
      return;
    }

    const url = await createCheckoutSession(
      req.user!.id,
      req.user!.email,
      plan,
      `${CLIENT_URL}/billing/success?plan=${plan}`,
      `${CLIENT_URL}/pricing`,
    );

    res.json({
      success: true,
      data: { url },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    handleBillingError(err, res);
  }
});

// ============================================================
// TOP-UP - Buy credit packs
// ============================================================

billingRouter.post("/topup", requireAuth, async (req: Request, res: Response) => {
  try {
    const { pack } = req.body;

    if (!pack) {
      res.status(400).json({ success: false, error: "Missing pack" });
      return;
    }

    const url = await createTopUpSession(
      req.user!.id,
      req.user!.email,
      pack,
      `${CLIENT_URL}/billing/success?topup=${pack}`,
      `${CLIENT_URL}/billing`,
    );

    res.json({
      success: true,
      data: { url },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    handleBillingError(err, res);
  }
});

// ============================================================
// WEBHOOK - Stripe event handler (raw body, no auth)
// ============================================================

billingRouter.post("/webhook", async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    res.status(400).json({ success: false, error: "Missing signature or webhook secret" });
    return;
  }

  try {
    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(
      req.body, // raw buffer
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    await handleWebhook(event);
    res.json({ received: true });
  } catch (err) {
    handleBillingError(err, res);
  }
});

// ============================================================
// USAGE - Current credit balance and plan info
// ============================================================

billingRouter.get("/usage", requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        plan: true,
        credits_remaining: true,
        credits_monthly: true,
        credits_reset_at: true,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    const resetAt = new Date(user.credits_reset_at);
    const nextReset = new Date(resetAt);
    nextReset.setDate(nextReset.getDate() + 30);

    res.json({
      success: true,
      data: {
        plan: user.plan,
        credits_remaining: user.credits_remaining,
        credits_monthly: user.credits_monthly,
        credits_used: user.credits_monthly - user.credits_remaining,
        next_reset: nextReset.toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Usage error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch usage" });
  }
});

// ============================================================
// PORTAL - Stripe customer portal for managing subscription
// ============================================================

billingRouter.post("/portal", requireAuth, async (req: Request, res: Response) => {
  try {
    const url = await createPortalSession(
      req.user!.id,
      req.user!.email,
      `${CLIENT_URL}/billing`,
    );

    res.json({
      success: true,
      data: { url },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    handleBillingError(err, res);
  }
});

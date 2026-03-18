import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { router } from "./routes/api.js";
import { authRouter } from "./routes/auth.js";
import { billingRouter } from "./routes/billing.js";
import { chatRouter } from "./routes/chat.js";
import { onboardRouter } from "./routes/onboard.js";
import { rewardsRouter } from "./routes/rewards.js";
import { optionalAuth } from "./middleware/auth.js";
import { startScheduler } from "./services/scheduler.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(",") || ["http://localhost:3001"],
}));

// Stripe webhook needs raw body - must be before express.json()
app.use("/api/v1/billing/webhook", express.raw({ type: "application/json" }));

// JSON body parsing for everything else
app.use(express.json({ limit: "10mb" }));

// Auth routes (no auth middleware needed on these)
app.use("/api/v1/auth", authRouter);

// Billing routes
app.use("/api/v1/billing", billingRouter);

// Chat routes (require auth)
app.use("/api/v1/chat", chatRouter);

// Onboarding routes (require auth)
app.use("/api/v1/onboard", onboardRouter);

// Rewards routes (require auth)
app.use("/api/v1/rewards", rewardsRouter);

// API routes (optional auth - attaches user if token present)
app.use("/api/v1", optionalAuth, router);

// Root
app.get("/", (_req, res) => {
  res.json({
    name: "Kai API",
    version: "0.1.0",
    description: "Social Media Intelligence Platform",
    endpoints: {
      health: "GET /api/v1/health",
      register: "POST /api/v1/auth/register",
      login: "POST /api/v1/auth/login",
      me: "GET /api/v1/auth/me",
      billing_checkout: "POST /api/v1/billing/checkout",
      billing_topup: "POST /api/v1/billing/topup",
      billing_usage: "GET /api/v1/billing/usage",
      billing_portal: "POST /api/v1/billing/portal",
      billing_webhook: "POST /api/v1/billing/webhook",
      chat_message: "POST /api/v1/chat/message",
      chat_history: "GET /api/v1/chat/history",
      chat_clear: "DELETE /api/v1/chat/clear",
      onboard_status: "GET /api/v1/onboard/status",
      onboard_step: "POST /api/v1/onboard/step{1-12}",
      onboard_skip: "POST /api/v1/onboard/skip/:step",
      scheduler_status: "GET /api/v1/scheduler/status",
      draft: "POST /api/v1/draft",
      decode: "POST /api/v1/decode",
      scoreboard: "GET /api/v1/scoreboard/:client_id",
      trending: "GET /api/v1/trending",
      train: "POST /api/v1/train",
      vault: "GET /api/v1/vault/:client_id/*",
    },
  });
});

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║           KAI API v0.1.0            ║
  ║   Social Media Intelligence Engine   ║
  ╠══════════════════════════════════════╣
  ║  Port: ${String(PORT).padEnd(29)}║
  ║  Env:  ${(process.env.NODE_ENV || "development").padEnd(29)}║
  ╚══════════════════════════════════════╝
  `);

  // Start background jobs
  startScheduler();
});

export default app;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const api_js_1 = require("./routes/api.js");
const auth_js_1 = require("./routes/auth.js");
const billing_js_1 = require("./routes/billing.js");
const chat_js_1 = require("./routes/chat.js");
const onboard_js_1 = require("./routes/onboard.js");
const rewards_js_1 = require("./routes/rewards.js");
const auth_js_2 = require("./middleware/auth.js");
const scheduler_js_1 = require("./services/scheduler.js");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGINS?.split(",") || ["http://localhost:3001"],
}));
// Stripe webhook needs raw body - must be before express.json()
app.use("/api/v1/billing/webhook", express_1.default.raw({ type: "application/json" }));
// JSON body parsing for everything else
app.use(express_1.default.json({ limit: "10mb" }));
// Auth routes (no auth middleware needed on these)
app.use("/api/v1/auth", auth_js_1.authRouter);
// Billing routes
app.use("/api/v1/billing", billing_js_1.billingRouter);
// Chat routes (require auth)
app.use("/api/v1/chat", chat_js_1.chatRouter);
// Onboarding routes (require auth)
app.use("/api/v1/onboard", onboard_js_1.onboardRouter);
// Rewards routes (require auth)
app.use("/api/v1/rewards", rewards_js_1.rewardsRouter);
// API routes (optional auth - attaches user if token present)
app.use("/api/v1", auth_js_2.optionalAuth, api_js_1.router);
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
    (0, scheduler_js_1.startScheduler)();
});
exports.default = app;
//# sourceMappingURL=index.js.map
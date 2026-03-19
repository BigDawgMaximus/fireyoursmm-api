"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_js_1 = require("../lib/prisma.js");
const auth_js_1 = require("../middleware/auth.js");
const manager_js_1 = require("../vault/manager.js");
const rewards_js_1 = require("./rewards.js");
exports.authRouter = (0, express_1.Router)();
const SALT_ROUNDS = 12;
// ============================================================
// REGISTER
// ============================================================
exports.authRouter.post("/register", async (req, res) => {
    try {
        const { email, password, name, referral_code } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, error: "Missing email or password" });
            return;
        }
        if (password.length < 8) {
            res.status(400).json({ success: false, error: "Password must be at least 8 characters" });
            return;
        }
        // Check if user exists
        const existing = await prisma_js_1.prisma.user.findUnique({ where: { email } });
        if (existing) {
            res.status(409).json({ success: false, error: "Email already registered" });
            return;
        }
        const password_hash = await bcrypt_1.default.hash(password, SALT_ROUNDS);
        const user = await prisma_js_1.prisma.user.create({
            data: {
                email,
                password_hash,
                name: name || null,
                referred_by: referral_code || null,
            },
            select: { id: true, email: true, name: true, plan: true, credits_remaining: true },
        });
        // Create vault for the user
        const vaultPath = await manager_js_1.vault.createVault(user.id);
        await prisma_js_1.prisma.user.update({
            where: { id: user.id },
            data: { vault_path: vaultPath },
        });
        // Award referral credits if referred
        if (referral_code) {
            (0, rewards_js_1.awardReferralSignup)(referral_code, user.id, email).catch((err) => console.error("[REFERRAL] Failed to award signup credits:", err));
        }
        const token = (0, auth_js_1.signToken)(user);
        res.status(201).json({
            success: true,
            data: {
                user,
                token,
            },
            timestamp: new Date().toISOString(),
        });
    }
    catch (err) {
        console.error("Register error:", err);
        const message = process.env.NODE_ENV === "development"
            ? `Registration failed: ${err instanceof Error ? err.message : String(err)}`
            : "Registration failed";
        res.status(500).json({ success: false, error: message });
    }
});
// ============================================================
// LOGIN
// ============================================================
exports.authRouter.post("/login", async (req, res) => {
    try {
        const { email, password, remember_me } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, error: "Missing email or password" });
            return;
        }
        const user = await prisma_js_1.prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, name: true, plan: true, credits_remaining: true, password_hash: true },
        });
        if (!user) {
            res.status(401).json({ success: false, error: "Invalid email or password" });
            return;
        }
        const valid = await bcrypt_1.default.compare(password, user.password_hash);
        if (!valid) {
            res.status(401).json({ success: false, error: "Invalid email or password" });
            return;
        }
        const token = (0, auth_js_1.signToken)(user, remember_me ? "30d" : "7d");
        // Don't return password_hash
        const { password_hash: _, ...safeUser } = user;
        res.json({
            success: true,
            data: {
                user: safeUser,
                token,
            },
            timestamp: new Date().toISOString(),
        });
    }
    catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, error: "Login failed" });
    }
});
// ============================================================
// ME - Get current user
// ============================================================
exports.authRouter.get("/me", auth_js_1.requireAuth, async (req, res) => {
    try {
        const user = await prisma_js_1.prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                name: true,
                plan: true,
                credits_remaining: true,
                credits_monthly: true,
                credits_reset_at: true,
                onboarding_complete: true,
                onboarding_step: true,
                timezone: true,
                brief_time: true,
                priority_platform: true,
                created_at: true,
            },
        });
        res.json({
            success: true,
            data: { user },
            timestamp: new Date().toISOString(),
        });
    }
    catch (err) {
        console.error("Me error:", err);
        res.status(500).json({ success: false, error: "Failed to fetch user" });
    }
});
// ============================================================
// FORGOT PASSWORD
// ============================================================
exports.authRouter.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        // Always return 200 — don't reveal whether the email exists
        if (!email) {
            res.json({ success: true, data: { message: "If an account exists with that email, we've sent a reset link." } });
            return;
        }
        const user = await prisma_js_1.prisma.user.findUnique({ where: { email }, select: { id: true, email: true } });
        if (user) {
            const resetToken = crypto_1.default.randomBytes(32).toString("hex");
            const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
            await prisma_js_1.prisma.user.update({
                where: { id: user.id },
                data: {
                    reset_token: resetToken,
                    reset_token_expiry: expiry,
                },
            });
            const resetUrl = `${process.env.CLIENT_URL || "http://localhost:3001"}/reset-password?token=${resetToken}`;
            console.log(`[AUTH] Password reset link for ${email}: ${resetUrl}`);
            // TODO: Send email with resetUrl via SendGrid/Resend/etc.
        }
        res.json({
            success: true,
            data: { message: "If an account exists with that email, we've sent a reset link." },
            timestamp: new Date().toISOString(),
        });
    }
    catch (err) {
        console.error("Forgot password error:", err);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
});
// ============================================================
// RESET PASSWORD
// ============================================================
exports.authRouter.post("/reset-password", async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            res.status(400).json({ success: false, error: "Missing token or password" });
            return;
        }
        if (password.length < 8) {
            res.status(400).json({ success: false, error: "Password must be at least 8 characters" });
            return;
        }
        const user = await prisma_js_1.prisma.user.findUnique({
            where: { reset_token: token },
            select: { id: true, reset_token_expiry: true },
        });
        if (!user || !user.reset_token_expiry || user.reset_token_expiry < new Date()) {
            res.status(400).json({ success: false, error: "Invalid or expired reset link. Please request a new one." });
            return;
        }
        const password_hash = await bcrypt_1.default.hash(password, SALT_ROUNDS);
        await prisma_js_1.prisma.user.update({
            where: { id: user.id },
            data: {
                password_hash,
                reset_token: null,
                reset_token_expiry: null,
            },
        });
        res.json({
            success: true,
            data: { message: "Password reset successfully. You can now log in." },
            timestamp: new Date().toISOString(),
        });
    }
    catch (err) {
        console.error("Reset password error:", err);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
});
//# sourceMappingURL=auth.js.map
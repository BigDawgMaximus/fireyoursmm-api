"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = signToken;
exports.requireAuth = requireAuth;
exports.optionalAuth = optionalAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_js_1 = require("../lib/prisma.js");
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
function signToken(user, expiresIn = "7d") {
    return jsonwebtoken_1.default.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: expiresIn });
}
// Required auth - returns 401 if no valid token
async function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        res.status(401).json({ success: false, error: "Missing authorization header" });
        return;
    }
    try {
        const token = header.slice(7);
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await prisma_js_1.prisma.user.findUnique({
            where: { id: payload.sub },
            select: { id: true, email: true, name: true, plan: true, credits_remaining: true },
        });
        if (!user) {
            res.status(401).json({ success: false, error: "User not found" });
            return;
        }
        req.user = user;
        next();
    }
    catch {
        res.status(401).json({ success: false, error: "Invalid token" });
    }
}
// Optional auth - attaches user if token present, continues either way
async function optionalAuth(req, _res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        next();
        return;
    }
    try {
        const token = header.slice(7);
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await prisma_js_1.prisma.user.findUnique({
            where: { id: payload.sub },
            select: { id: true, email: true, name: true, plan: true, credits_remaining: true },
        });
        if (user) {
            req.user = user;
        }
    }
    catch {
        // Invalid token, continue without user
    }
    next();
}
//# sourceMappingURL=auth.js.map
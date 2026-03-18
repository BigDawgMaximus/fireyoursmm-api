import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  plan: string;
  credits_remaining: number;
}

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function signToken(user: { id: string; email: string }, expiresIn: string = "7d"): string {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: expiresIn as jwt.SignOptions["expiresIn"] });
}

// Required auth - returns 401 if no valid token
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ success: false, error: "Missing authorization header" });
    return;
  }

  try {
    const token = header.slice(7);
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string; email: string };

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, plan: true, credits_remaining: true },
    });

    if (!user) {
      res.status(401).json({ success: false, error: "User not found" });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ success: false, error: "Invalid token" });
  }
}

// Optional auth - attaches user if token present, continues either way
export async function optionalAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    next();
    return;
  }

  try {
    const token = header.slice(7);
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string; email: string };

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, plan: true, credits_remaining: true },
    });

    if (user) {
      req.user = user;
    }
  } catch {
    // Invalid token, continue without user
  }

  next();
}

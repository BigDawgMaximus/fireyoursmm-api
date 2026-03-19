import type { Request, Response, NextFunction } from "express";
export interface AuthUser {
    id: string;
    email: string;
    name: string | null;
    plan: string;
    credits_remaining: number;
}
declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}
export declare function signToken(user: {
    id: string;
    email: string;
}, expiresIn?: string): string;
export declare function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function optionalAuth(req: Request, _res: Response, next: NextFunction): Promise<void>;

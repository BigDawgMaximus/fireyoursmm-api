import Stripe from "stripe";
export declare function getStripe(): Stripe;
export declare class BillingNotConfiguredError extends Error {
    constructor();
}
export declare function createCheckoutSession(userId: string, email: string, plan: string, successUrl: string, cancelUrl: string): Promise<string>;
export declare function createTopUpSession(userId: string, email: string, pack: string, successUrl: string, cancelUrl: string): Promise<string>;
export declare function createPortalSession(userId: string, email: string, returnUrl: string): Promise<string>;
export declare function handleWebhook(event: Stripe.Event): Promise<void>;

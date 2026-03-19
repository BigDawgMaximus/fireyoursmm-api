export declare const rewardsRouter: import("express-serve-static-core").Router;
export declare function awardAutoReward(userId: string, type: string, description: string): Promise<void>;
export declare function awardReferralSignup(referrerCode: string, referredUserId: string, referredEmail: string): Promise<void>;
export declare function awardReferralPaid(referredUserId: string): Promise<void>;

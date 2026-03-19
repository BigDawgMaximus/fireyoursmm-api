import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly User: "User";
    readonly Competitor: "Competitor";
    readonly UserPlatform: "UserPlatform";
    readonly ChatMessage: "ChatMessage";
    readonly GeneratedContent: "GeneratedContent";
    readonly ScrapeResult: "ScrapeResult";
    readonly Reward: "Reward";
    readonly Referral: "Referral";
    readonly ExperimentLog: "ExperimentLog";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly email: "email";
    readonly password_hash: "password_hash";
    readonly name: "name";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
    readonly stripe_customer_id: "stripe_customer_id";
    readonly plan: "plan";
    readonly credits_remaining: "credits_remaining";
    readonly credits_monthly: "credits_monthly";
    readonly credits_reset_at: "credits_reset_at";
    readonly onboarding_complete: "onboarding_complete";
    readonly onboarding_step: "onboarding_step";
    readonly vault_path: "vault_path";
    readonly timezone: "timezone";
    readonly brief_time: "brief_time";
    readonly priority_platform: "priority_platform";
    readonly reset_token: "reset_token";
    readonly reset_token_expiry: "reset_token_expiry";
    readonly referral_code: "referral_code";
    readonly referred_by: "referred_by";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const CompetitorScalarFieldEnum: {
    readonly id: "id";
    readonly user_id: "user_id";
    readonly platform: "platform";
    readonly username: "username";
    readonly added_at: "added_at";
    readonly last_scraped: "last_scraped";
};
export type CompetitorScalarFieldEnum = (typeof CompetitorScalarFieldEnum)[keyof typeof CompetitorScalarFieldEnum];
export declare const UserPlatformScalarFieldEnum: {
    readonly id: "id";
    readonly user_id: "user_id";
    readonly platform: "platform";
    readonly handle: "handle";
    readonly is_priority: "is_priority";
};
export type UserPlatformScalarFieldEnum = (typeof UserPlatformScalarFieldEnum)[keyof typeof UserPlatformScalarFieldEnum];
export declare const ChatMessageScalarFieldEnum: {
    readonly id: "id";
    readonly user_id: "user_id";
    readonly role: "role";
    readonly content: "content";
    readonly credits_used: "credits_used";
    readonly created_at: "created_at";
};
export type ChatMessageScalarFieldEnum = (typeof ChatMessageScalarFieldEnum)[keyof typeof ChatMessageScalarFieldEnum];
export declare const GeneratedContentScalarFieldEnum: {
    readonly id: "id";
    readonly user_id: "user_id";
    readonly type: "type";
    readonly platform: "platform";
    readonly input: "input";
    readonly output: "output";
    readonly credits_used: "credits_used";
    readonly velocity_score: "velocity_score";
    readonly approved: "approved";
    readonly created_at: "created_at";
};
export type GeneratedContentScalarFieldEnum = (typeof GeneratedContentScalarFieldEnum)[keyof typeof GeneratedContentScalarFieldEnum];
export declare const ScrapeResultScalarFieldEnum: {
    readonly id: "id";
    readonly platform: "platform";
    readonly username: "username";
    readonly post_text: "post_text";
    readonly post_url: "post_url";
    readonly likes: "likes";
    readonly replies: "replies";
    readonly retweets: "retweets";
    readonly bookmarks: "bookmarks";
    readonly views: "views";
    readonly hook_type: "hook_type";
    readonly posted_at: "posted_at";
    readonly scraped_at: "scraped_at";
};
export type ScrapeResultScalarFieldEnum = (typeof ScrapeResultScalarFieldEnum)[keyof typeof ScrapeResultScalarFieldEnum];
export declare const RewardScalarFieldEnum: {
    readonly id: "id";
    readonly user_id: "user_id";
    readonly type: "type";
    readonly credits: "credits";
    readonly description: "description";
    readonly proof_url: "proof_url";
    readonly status: "status";
    readonly metadata: "metadata";
    readonly created_at: "created_at";
    readonly reviewed_at: "reviewed_at";
};
export type RewardScalarFieldEnum = (typeof RewardScalarFieldEnum)[keyof typeof RewardScalarFieldEnum];
export declare const ReferralScalarFieldEnum: {
    readonly id: "id";
    readonly referrer_id: "referrer_id";
    readonly referred_email: "referred_email";
    readonly referred_user_id: "referred_user_id";
    readonly status: "status";
    readonly credits_awarded: "credits_awarded";
    readonly created_at: "created_at";
    readonly converted_at: "converted_at";
};
export type ReferralScalarFieldEnum = (typeof ReferralScalarFieldEnum)[keyof typeof ReferralScalarFieldEnum];
export declare const ExperimentLogScalarFieldEnum: {
    readonly id: "id";
    readonly user_id: "user_id";
    readonly date: "date";
    readonly type: "type";
    readonly variant: "variant";
    readonly content: "content";
    readonly score: "score";
    readonly was_used: "was_used";
    readonly actual_engagement: "actual_engagement";
};
export type ExperimentLogScalarFieldEnum = (typeof ExperimentLogScalarFieldEnum)[keyof typeof ExperimentLogScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
//# sourceMappingURL=prismaNamespaceBrowser.d.ts.map
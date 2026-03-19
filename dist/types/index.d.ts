export interface KaiClient {
    id: string;
    name: string;
    telegram_chat_id?: string;
    role: ClientRole;
    platforms: Platform[];
    tier: PricingTier;
    vault_path: string;
    onboarding_complete: boolean;
    created_at: string;
    updated_at: string;
}
export type ClientRole = "ceo" | "cto" | "marketing" | "community" | "kol" | "agency";
export type Platform = "x" | "instagram" | "linkedin" | "telegram" | "facebook" | "tiktok" | "youtube" | "threads";
export type PricingTier = "growth" | "protocol" | "enterprise";
export interface OnboardingState {
    client_id: string;
    current_step: OnboardingStep;
    completed_steps: OnboardingStep[];
    data: {
        best_posts?: string[];
        competitors?: string[];
        documents?: string[];
        platforms?: Platform[];
        role?: ClientRole;
        aspiration_posts?: string[];
    };
}
export type OnboardingStep = "best_content" | "competitors" | "knowledge_base" | "platforms" | "role" | "aspiration_content" | "complete";
export interface DraftRequest {
    client_id: string;
    raw_text: string;
    platforms: Platform[];
    role?: ClientRole;
    retention?: boolean;
}
export interface DraftResponse {
    drafts: PlatformDraft[];
    hook_analysis: HookAnalysis;
    structure_analysis: StructureAnalysis;
    trigger_analysis: TriggerAnalysis;
    sentiment_analysis: SentimentAnalysis;
    timing_analysis: TimingAnalysis;
    velocity_score: number;
}
export interface PlatformDraft {
    platform: Platform;
    main_post: string;
    self_reply?: string;
    second_reply?: string;
    carousel_slides?: string[];
    reel_script?: string;
    video_script?: string;
    long_form_outline?: string;
    thumbnail_concept?: string;
    community_post?: string;
    story_frames?: string[];
    hashtags?: string[];
    notes: string;
}
export interface HookAnalysis {
    score: number;
    current_hook: string;
    alternatives: Array<{
        hook: string;
        reasoning: string;
        estimated_score: number;
    }>;
    pattern_match: string;
}
export interface StructureAnalysis {
    score: number;
    checks: Array<{
        rule: string;
        passed: boolean;
        fix?: string;
    }>;
}
export interface TriggerAnalysis {
    has_trigger: boolean;
    triggers: Array<{
        text: string;
        type: "binary_choice" | "open_question" | "controversial" | "identity" | "prediction";
        estimated_reply_rate: string;
        placement: "inline" | "end" | "self_reply";
    }>;
}
export interface SentimentAnalysis {
    risk_score: number;
    flags: string[];
    candidate_isolation_risk: boolean;
    suggestions: string[];
}
export interface TimingAnalysis {
    recommended_time: string;
    reasoning: string;
    velocity_plan: string;
}
export interface DecodeRequest {
    client_id: string;
    url: string;
}
export interface DecodeResponse {
    post: ScrapedPost;
    hook_pattern: string;
    structure_breakdown: string;
    trigger_mechanism: string;
    sentiment_positioning: string;
    timing_analysis: string;
    velocity_estimate: string;
    replication_playbook: string;
}
export interface ScoreboardEntry {
    handle: string;
    posts_count: number;
    avg_engagement_rate: number;
    top_post_engagement: number;
    follower_count: number;
    follower_change: number;
}
export interface ScrapedPost {
    text: string;
    date: string;
    platform: Platform;
    author_handle: string;
    metrics: PostMetrics;
    media_type: "text" | "image" | "video" | "carousel" | "link";
    url?: string;
}
export interface PostMetrics {
    likes: number;
    replies: number;
    retweets?: number;
    bookmarks?: number;
    views?: number;
    shares?: number;
    saves?: number;
    reactions?: Record<string, number>;
    comments?: number;
    reposts?: number;
    watch_time_seconds?: number;
    completion_rate?: number;
    clicks?: number;
    impressions?: number;
    reach?: number;
    profile_visits?: number;
    subscribers_gained?: number;
}
export interface ScrapedProfile {
    handle: string;
    platform: Platform;
    display_name: string;
    bio: string;
    followers: number;
    following: number;
    posts_count: number;
    verified: boolean;
    profile_image_url?: string;
    scraped_at: string;
}
export interface VaultFile {
    path: string;
    content: string;
    last_modified: string;
}
export interface VaultSearchResult {
    file_path: string;
    snippet: string;
    relevance: number;
}
export interface GenerateRequest {
    client_id: string;
    topic: string;
    platform: Platform;
    role?: ClientRole;
    mode?: "fast" | "quality";
}
export interface RewriteRequest {
    client_id: string;
    text: string;
    platform: Platform;
    role?: ClientRole;
}
export interface BriefRequest {
    client_id: string;
    platforms?: Platform[];
    role?: ClientRole;
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    timestamp: string;
}
//# sourceMappingURL=index.d.ts.map
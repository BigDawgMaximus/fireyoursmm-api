// ============================================================
// KAI PLATFORM - CORE TYPES
// ============================================================

// --- Client / Account ---

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

export type ClientRole =
  | "ceo"
  | "cto"
  | "marketing"
  | "community"
  | "kol"
  | "agency";

export type Platform = "x" | "instagram" | "linkedin" | "telegram" | "facebook" | "tiktok" | "youtube" | "threads";

export type PricingTier = "growth" | "protocol" | "enterprise";

// --- Onboarding ---

export interface OnboardingState {
  client_id: string;
  current_step: OnboardingStep;
  completed_steps: OnboardingStep[];
  data: {
    best_posts?: string[];       // URLs or raw text
    competitors?: string[];       // @handles
    documents?: string[];         // file paths in vault
    platforms?: Platform[];
    role?: ClientRole;
    aspiration_posts?: string[];  // "posts you wish you wrote"
  };
}

export type OnboardingStep =
  | "best_content"
  | "competitors"
  | "knowledge_base"
  | "platforms"
  | "role"
  | "aspiration_content"
  | "complete";

// --- Drafting ---

export interface DraftRequest {
  client_id: string;
  raw_text: string;
  platforms: Platform[];
  role?: ClientRole;            // override client default
  retention?: boolean;          // save draft to vault
}

export interface DraftResponse {
  drafts: PlatformDraft[];
  hook_analysis: HookAnalysis;
  structure_analysis: StructureAnalysis;
  trigger_analysis: TriggerAnalysis;
  sentiment_analysis: SentimentAnalysis;
  timing_analysis: TimingAnalysis;
  velocity_score: number;       // 1-100
}

export interface PlatformDraft {
  platform: Platform;
  main_post: string;
  self_reply?: string;          // for X: link + cashtags
  second_reply?: string;        // for X: cashtags
  carousel_slides?: string[];   // for Instagram, TikTok photo carousels
  reel_script?: string;         // for Instagram Reels
  video_script?: string;        // for TikTok, YouTube Shorts, Facebook Reels
  long_form_outline?: string;   // for YouTube long form, LinkedIn articles
  thumbnail_concept?: string;   // for YouTube
  community_post?: string;      // for YouTube community tab
  story_frames?: string[];      // for Instagram/Facebook Stories
  hashtags?: string[];          // platform-appropriate hashtags
  notes: string;                // platform-specific tips
}

// --- Agent Outputs ---

export interface HookAnalysis {
  score: number;                // 1-10
  current_hook: string;
  alternatives: Array<{
    hook: string;
    reasoning: string;
    estimated_score: number;
  }>;
  pattern_match: string;        // which known pattern it matches
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
  risk_score: number;           // 1-10
  flags: string[];
  candidate_isolation_risk: boolean;
  suggestions: string[];
}

export interface TimingAnalysis {
  recommended_time: string;     // e.g. "9:30 AM EST"
  reasoning: string;
  velocity_plan: string;        // 30-min engagement plan
}

// --- Decode ---

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
  replication_playbook: string; // how YOUR brand would do this
}

// --- Scoreboard ---

export interface ScoreboardEntry {
  handle: string;
  posts_count: number;
  avg_engagement_rate: number;
  top_post_engagement: number;
  follower_count: number;
  follower_change: number;      // delta over period
}

// --- Scraper Types (shared with kai-scraper) ---

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
  retweets?: number;            // X
  bookmarks?: number;           // X
  views?: number;               // X, TikTok, YouTube, Facebook
  shares?: number;              // Facebook, LinkedIn, TikTok, Threads
  saves?: number;               // Instagram, TikTok
  reactions?: Record<string, number>; // Facebook (like, love, haha, wow, sad, angry)
  comments?: number;            // Instagram, Facebook, YouTube, TikTok, LinkedIn
  reposts?: number;             // Threads
  watch_time_seconds?: number;  // TikTok, YouTube
  completion_rate?: number;     // TikTok, YouTube Shorts (0-1)
  clicks?: number;              // LinkedIn, Facebook
  impressions?: number;         // All platforms
  reach?: number;               // Instagram, Facebook
  profile_visits?: number;      // Instagram, TikTok
  subscribers_gained?: number;  // YouTube
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

// --- Vault ---

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

// --- Intelligence Generation ---

export interface GenerateRequest {
  client_id: string;
  topic: string;
  platform: Platform;
  role?: ClientRole;
  mode?: "fast" | "quality";  // fast = deterministic, quality = Haiku (default)
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

// --- API Response Wrapper ---

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

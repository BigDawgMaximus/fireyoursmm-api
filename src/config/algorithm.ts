// ============================================================
// X ALGORITHM INTELLIGENCE (PHOENIX, 2026)
// This is baked into every agent's system prompt context.
// Update this file as algorithm weights change.
// ============================================================

export const X_ALGORITHM = {
  // Engagement signal multipliers (open-source confirmed)
  signals: {
    author_reply_back: 150,     // You replying to someone who replied to you
    engaged_reply: 75,          // A reply to your post that itself gets engagement
    reply: 27,                  // Someone replying to your post
    retweet: 20,
    direct_reply: 13.5,
    profile_click_engage: 12,   // Someone clicks your profile then engages
    bookmark: 10,
    like: 1,                    // Nearly worthless
    link_click: 0.5,            // PENALTY territory
    report: -150,
    block: -300,
  },

  // Core rules
  rules: {
    velocity_window_minutes: 30, // First 30-60 min determines everything
    premium_boost_in_network: 4,
    premium_boost_out_network: 2,
    text_reach_bonus: "30-50% more reach than images/links",
    link_penalty: "30-50% reach reduction",
    max_hashtags: 1,
    optimal_hashtags: 0,
    follow_ratio_max: 0.6,      // following:follower ratio
    optimal_char_range: { min: 71, max: 100 },
  },

  // Content mix formula
  content_mix: {
    breaking_news: 0.60,        // Short + cashtags
    hot_takes: 0.25,            // Opinionated, contrarian
    threads: 0.15,              // Deep dives
  },

  // Timing windows (EST)
  optimal_times_est: [
    { start: "09:00", end: "11:00", label: "morning" },
    { start: "14:00", end: "16:00", label: "afternoon" },
    { start: "20:00", end: "22:00", label: "evening" },
  ],

  // 30-min playbook
  velocity_playbook: [
    "Post main tweet (text only, no links)",
    "Immediately: self-reply with source link",
    "2nd self-reply with cashtags (if crypto)",
    "Reply to every comment for 30 minutes",
    "After 60 min: add link to main tweet reply if needed",
  ],
} as const;

export const PLATFORM_RULES = {
  x: {
    text_first: true,
    links_in_main: false,       // Always self-reply
    max_chars: 280,
    reply_triggers: true,
    cashtags: "self_reply",
    hashtags: { max: 1, recommended: 0 },
    media_reduces_reach: true,
  },
  instagram: {
    carousel_max_slides: 10,
    reel_optimal_seconds: { min: 15, max: 60 },
    hashtags: { max: 30, recommended: "5-10 targeted" },
    links_in_bio_only: true,
    cta_in_caption: true,
  },
  linkedin: {
    links_ok: true,
    professional_tone: true,
    optimal_length: "1000-1300 chars",
    hashtags: { max: 5, recommended: 3 },
    native_docs_boost: true,
  },
  telegram: {
    inline_links: true,
    markdown_formatting: true,
    no_char_limit: true,
    emoji_forward: true,
  },
  facebook: {
    shares_highest_signal: true,
    links_ok: true,
    optimal_length: "100-250 chars for posts, longer for articles",
    native_video_boost: true,
    reels_prioritized: true,
    groups_boost_reach: true,
    hashtags: { max: 3, recommended: "0-2" },
    comment_replies_boost: true,
    first_hour_critical: true,
    image_posts_outperform_text: true,
  },
  tiktok: {
    video_only: true,
    optimal_length_seconds: { min: 15, max: 60 },
    completion_rate_is_king: true,
    hook_in_first_3_seconds: true,
    trending_sounds_boost: true,
    text_overlay_required: true,
    hashtags: { max: 5, recommended: "3-5 targeted" },
    post_frequency: "1-3/day for growth",
    photo_carousels_rising: true,
    duet_stitch_boost_reach: true,
  },
  youtube: {
    ctr_on_thumbnail: "most important signal",
    watch_time_over_views: true,
    shorts_optimal_seconds: { min: 15, max: 60 },
    long_form_optimal_minutes: { min: 8, max: 15 },
    community_posts_boost_subs: true,
    first_24h_velocity: true,
    description_seo: true,
    hashtags: { max: 3, recommended: "2-3 in description" },
    end_screens_and_cards: true,
    session_duration_signal: true,
  },
  threads: {
    text_first: true,
    max_chars: 500,
    replies_highest_signal: true,
    reposts_boost: true,
    early_engagement_velocity: true,
    links_ok: true,
    hashtags: { max: 1, recommended: 0 },
    instagram_crosspost_boost: true,
    casual_tone_outperforms: true,
  },
} as const;

// Viral post models (reference accounts)
export const VIRAL_MODELS = {
  velocity: "@zerohedge",       // Speed + breaking
  threads: "@RaoulGMI",         // Bookmarks + depth
  fomo: "@DiscoverCrypto",      // FOMO hooks
  authority: "@sama",           // Low frequency, high impact
} as const;

// Hook pattern library (updated from training data)
export const HOOK_PATTERNS = [
  { name: "urgency_break", template: "BREAKING: {event}", weight: 0.9 },
  { name: "contrarian", template: "{consensus} is wrong. Here's why:", weight: 0.85 },
  { name: "number_hook", template: "{metric}. Let that sink in.", weight: 0.8 },
  { name: "binary_choice", template: "{option_a} or {option_b}?", weight: 0.75 },
  { name: "prediction", template: "{thing} will {prediction} by {date}.", weight: 0.7 },
  { name: "insider", template: "Nobody is talking about {thing}.", weight: 0.7 },
  { name: "listicle", template: "{n} {things} that {outcome}:", weight: 0.65 },
  { name: "question", template: "Why is no one asking about {thing}?", weight: 0.6 },
] as const;

// Trigger pattern library
export const TRIGGER_PATTERNS = [
  { name: "binary_choice", example: "Bullish or bearish?", reply_rate: "high" },
  { name: "fill_blank", example: "The most underrated project is ___", reply_rate: "high" },
  { name: "hot_take", example: "Unpopular opinion: {take}", reply_rate: "high" },
  { name: "tag_someone", example: "Tag someone who needs to see this", reply_rate: "medium" },
  { name: "open_question", example: "What am I missing?", reply_rate: "medium" },
  { name: "prediction_bet", example: "Screenshot this.", reply_rate: "medium" },
  { name: "agree_disagree", example: "Agree?", reply_rate: "medium" },
] as const;

// Words to NEVER use (AI-sounding)
export const BANNED_WORDS = [
  "leverage", "utilize", "comprehensive", "cutting-edge", "seamless",
  "harness", "robust", "elevate", "craft", "delve", "foster",
  "landscape", "navigate", "paradigm", "streamline", "synergy",
  "empower", "innovative", "transform", "revolutionize",
  "excited to announce", "thrilled to share", "game-changing",
  "we're proud to", "groundbreaking",
] as const;

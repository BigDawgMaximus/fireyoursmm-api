export declare const X_ALGORITHM: {
    readonly signals: {
        readonly author_reply_back: 150;
        readonly engaged_reply: 75;
        readonly reply: 27;
        readonly retweet: 20;
        readonly direct_reply: 13.5;
        readonly profile_click_engage: 12;
        readonly bookmark: 10;
        readonly like: 1;
        readonly link_click: 0.5;
        readonly report: -150;
        readonly block: -300;
    };
    readonly rules: {
        readonly velocity_window_minutes: 30;
        readonly premium_boost_in_network: 4;
        readonly premium_boost_out_network: 2;
        readonly text_reach_bonus: "30-50% more reach than images/links";
        readonly link_penalty: "30-50% reach reduction";
        readonly max_hashtags: 1;
        readonly optimal_hashtags: 0;
        readonly follow_ratio_max: 0.6;
        readonly optimal_char_range: {
            readonly min: 71;
            readonly max: 100;
        };
    };
    readonly content_mix: {
        readonly breaking_news: 0.6;
        readonly hot_takes: 0.25;
        readonly threads: 0.15;
    };
    readonly optimal_times_est: readonly [{
        readonly start: "09:00";
        readonly end: "11:00";
        readonly label: "morning";
    }, {
        readonly start: "14:00";
        readonly end: "16:00";
        readonly label: "afternoon";
    }, {
        readonly start: "20:00";
        readonly end: "22:00";
        readonly label: "evening";
    }];
    readonly velocity_playbook: readonly ["Post main tweet (text only, no links)", "Immediately: self-reply with source link", "2nd self-reply with cashtags (if crypto)", "Reply to every comment for 30 minutes", "After 60 min: add link to main tweet reply if needed"];
};
export declare const PLATFORM_RULES: {
    readonly x: {
        readonly text_first: true;
        readonly links_in_main: false;
        readonly max_chars: 280;
        readonly reply_triggers: true;
        readonly cashtags: "self_reply";
        readonly hashtags: {
            readonly max: 1;
            readonly recommended: 0;
        };
        readonly media_reduces_reach: true;
    };
    readonly instagram: {
        readonly carousel_max_slides: 10;
        readonly reel_optimal_seconds: {
            readonly min: 15;
            readonly max: 60;
        };
        readonly hashtags: {
            readonly max: 30;
            readonly recommended: "5-10 targeted";
        };
        readonly links_in_bio_only: true;
        readonly cta_in_caption: true;
    };
    readonly linkedin: {
        readonly links_ok: true;
        readonly professional_tone: true;
        readonly optimal_length: "1000-1300 chars";
        readonly hashtags: {
            readonly max: 5;
            readonly recommended: 3;
        };
        readonly native_docs_boost: true;
    };
    readonly telegram: {
        readonly inline_links: true;
        readonly markdown_formatting: true;
        readonly no_char_limit: true;
        readonly emoji_forward: true;
    };
    readonly facebook: {
        readonly shares_highest_signal: true;
        readonly links_ok: true;
        readonly optimal_length: "100-250 chars for posts, longer for articles";
        readonly native_video_boost: true;
        readonly reels_prioritized: true;
        readonly groups_boost_reach: true;
        readonly hashtags: {
            readonly max: 3;
            readonly recommended: "0-2";
        };
        readonly comment_replies_boost: true;
        readonly first_hour_critical: true;
        readonly image_posts_outperform_text: true;
    };
    readonly tiktok: {
        readonly video_only: true;
        readonly optimal_length_seconds: {
            readonly min: 15;
            readonly max: 60;
        };
        readonly completion_rate_is_king: true;
        readonly hook_in_first_3_seconds: true;
        readonly trending_sounds_boost: true;
        readonly text_overlay_required: true;
        readonly hashtags: {
            readonly max: 5;
            readonly recommended: "3-5 targeted";
        };
        readonly post_frequency: "1-3/day for growth";
        readonly photo_carousels_rising: true;
        readonly duet_stitch_boost_reach: true;
    };
    readonly youtube: {
        readonly ctr_on_thumbnail: "most important signal";
        readonly watch_time_over_views: true;
        readonly shorts_optimal_seconds: {
            readonly min: 15;
            readonly max: 60;
        };
        readonly long_form_optimal_minutes: {
            readonly min: 8;
            readonly max: 15;
        };
        readonly community_posts_boost_subs: true;
        readonly first_24h_velocity: true;
        readonly description_seo: true;
        readonly hashtags: {
            readonly max: 3;
            readonly recommended: "2-3 in description";
        };
        readonly end_screens_and_cards: true;
        readonly session_duration_signal: true;
    };
    readonly threads: {
        readonly text_first: true;
        readonly max_chars: 500;
        readonly replies_highest_signal: true;
        readonly reposts_boost: true;
        readonly early_engagement_velocity: true;
        readonly links_ok: true;
        readonly hashtags: {
            readonly max: 1;
            readonly recommended: 0;
        };
        readonly instagram_crosspost_boost: true;
        readonly casual_tone_outperforms: true;
    };
};
export declare const VIRAL_MODELS: {
    readonly velocity: "@zerohedge";
    readonly threads: "@RaoulGMI";
    readonly fomo: "@DiscoverCrypto";
    readonly authority: "@sama";
};
export declare const HOOK_PATTERNS: readonly [{
    readonly name: "urgency_break";
    readonly template: "BREAKING: {event}";
    readonly weight: 0.9;
}, {
    readonly name: "contrarian";
    readonly template: "{consensus} is wrong. Here's why:";
    readonly weight: 0.85;
}, {
    readonly name: "number_hook";
    readonly template: "{metric}. Let that sink in.";
    readonly weight: 0.8;
}, {
    readonly name: "binary_choice";
    readonly template: "{option_a} or {option_b}?";
    readonly weight: 0.75;
}, {
    readonly name: "prediction";
    readonly template: "{thing} will {prediction} by {date}.";
    readonly weight: 0.7;
}, {
    readonly name: "insider";
    readonly template: "Nobody is talking about {thing}.";
    readonly weight: 0.7;
}, {
    readonly name: "listicle";
    readonly template: "{n} {things} that {outcome}:";
    readonly weight: 0.65;
}, {
    readonly name: "question";
    readonly template: "Why is no one asking about {thing}?";
    readonly weight: 0.6;
}];
export declare const TRIGGER_PATTERNS: readonly [{
    readonly name: "binary_choice";
    readonly example: "Bullish or bearish?";
    readonly reply_rate: "high";
}, {
    readonly name: "fill_blank";
    readonly example: "The most underrated project is ___";
    readonly reply_rate: "high";
}, {
    readonly name: "hot_take";
    readonly example: "Unpopular opinion: {take}";
    readonly reply_rate: "high";
}, {
    readonly name: "tag_someone";
    readonly example: "Tag someone who needs to see this";
    readonly reply_rate: "medium";
}, {
    readonly name: "open_question";
    readonly example: "What am I missing?";
    readonly reply_rate: "medium";
}, {
    readonly name: "prediction_bet";
    readonly example: "Screenshot this.";
    readonly reply_rate: "medium";
}, {
    readonly name: "agree_disagree";
    readonly example: "Agree?";
    readonly reply_rate: "medium";
}];
export declare const BANNED_WORDS: readonly ["leverage", "utilize", "comprehensive", "cutting-edge", "seamless", "harness", "robust", "elevate", "craft", "delve", "foster", "landscape", "navigate", "paradigm", "streamline", "synergy", "empower", "innovative", "transform", "revolutionize", "excited to announce", "thrilled to share", "game-changing", "we're proud to", "groundbreaking"];
//# sourceMappingURL=algorithm.d.ts.map
export interface DailyBrief {
    client_id: string;
    generated_at: string;
    competitor_overnight: CompetitorOvernight[];
    trending_topics: TrendingTopic[];
    yesterday_recap: YesterdayRecap;
    todays_content: ScheduledPost[];
    raw_text: string;
}
interface CompetitorOvernight {
    handle: string;
    posts_count: number;
    top_post?: {
        text: string;
        engagement: number;
        url?: string;
        why_it_worked?: string;
    };
    notable_moves: string[];
}
interface TrendingTopic {
    topic: string;
    velocity: string;
    relevance: string;
    content_angle: string;
}
interface YesterdayRecap {
    posts_count: number;
    total_impressions: number;
    best_post?: {
        text: string;
        engagement: number;
        why_it_worked: string;
    };
    weakest_post?: {
        text: string;
        engagement: number;
        what_went_wrong: string;
    };
    avg_engagement_rate: number;
}
interface ScheduledPost {
    post_number: number;
    scheduled_time: string;
    content_type: string;
    main_post: string;
    self_reply?: string;
    second_reply?: string;
    velocity_score: number;
    reasoning: string;
}
export declare function generateDailyBrief(clientId: string): Promise<DailyBrief>;
export declare function runScheduledBriefs(): Promise<void>;
export {};

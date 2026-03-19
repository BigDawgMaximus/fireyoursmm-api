import type { ScrapedPost, ScrapedProfile, Platform } from "../types/index.js";
export declare const scraper: {
    health(): Promise<{
        status: string;
        active_jobs: number;
    }>;
    scrapeProfile(platform: Platform, handle: string): Promise<ScrapedProfile>;
    scrapePosts(platform: Platform, handle: string, count?: number): Promise<{
        posts: ScrapedPost[];
    }>;
    scrapePostDetail(url: string): Promise<ScrapedPost & {
        replies_sample: string[];
    }>;
    scrapeTrending(platform: Platform, sector?: string): Promise<{
        topics: Array<{
            name: string;
            velocity: number;
            sample_posts: ScrapedPost[];
        }>;
    }>;
    scrapeSearch(platform: Platform, query: string, count?: number): Promise<{
        posts: ScrapedPost[];
    }>;
};

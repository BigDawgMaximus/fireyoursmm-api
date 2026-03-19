import { type Experiment } from "./experiment-log.js";
export interface AutoresearchResult {
    total_experiments: number;
    top_hooks: Experiment[];
    best_format: {
        format: string;
        score: number;
    } | null;
    optimal_times: Array<{
        slot: string;
        score: number;
    }>;
    rising_pillars: string[];
    declining_pillars: string[];
    competitor_gaps: Array<{
        topic: string;
        score: number;
    }>;
    voice_drift_score: number;
    recommendations: string[];
    cost_usd: number;
    duration_ms: number;
}
export declare function runContentResearch(userId: string): Promise<AutoresearchResult>;

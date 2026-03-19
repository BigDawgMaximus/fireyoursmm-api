export interface Experiment {
    type: "hook" | "format" | "timing" | "pillar" | "gap" | "voice";
    variant: string;
    content?: string;
    score: number;
}
export declare function saveExperiments(userId: string, experiments: Experiment[]): Promise<number>;
export declare function getRecentExperiments(userId: string, days?: number, type?: string): Promise<Array<{
    type: string;
    variant: string;
    content: string | null;
    score: number;
    was_used: boolean;
    actual_engagement: number | null;
    date: Date;
}>>;
/**
 * When a user actually uses a suggested hook/draft, mark it and store
 * real engagement once available. This closes the feedback loop.
 */
export declare function markExperimentUsed(experimentId: string, actualEngagement?: number): Promise<void>;
/**
 * Calculate calibration factor: how well do our scores predict actual engagement?
 * Returns a multiplier per experiment type.
 */
export declare function getCalibrationFactors(userId: string): Promise<Record<string, number>>;

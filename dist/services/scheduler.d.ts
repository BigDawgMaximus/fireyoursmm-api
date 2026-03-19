interface JobStatus {
    name: string;
    schedule: string;
    last_run: string | null;
    next_run: string | null;
    running: boolean;
}
export declare function startScheduler(): void;
export declare function getSchedulerStatus(): JobStatus[];
export {};
//# sourceMappingURL=scheduler.d.ts.map
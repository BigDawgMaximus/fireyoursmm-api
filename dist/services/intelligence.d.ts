import type { Platform } from "../types/index.js";
type GenerationMode = "hook" | "post" | "rewrite" | "brief";
export declare function generateWithPatterns(clientId: string, prompt: string, platform: Platform, mode: GenerationMode, role?: string): Promise<string>;
export declare function generateIntelligenceBrief(clientId: string, platforms: Platform[], role?: string): Promise<string>;
export {};
//# sourceMappingURL=intelligence.d.ts.map
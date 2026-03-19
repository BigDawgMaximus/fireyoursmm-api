export declare function analyzeVoice(clientId: string, role: string, posts: string[]): Promise<string>;
export declare function analyzeAspirationVoice(clientId: string, role: string, aspirationPosts: string[]): Promise<string>;
export declare function extractTrainingPatterns(clientId: string, posts: string[]): Promise<void>;

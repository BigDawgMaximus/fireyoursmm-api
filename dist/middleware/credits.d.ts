export declare function deductCredits(userId: string, amount: number, type: string): Promise<{
    success: boolean;
    remaining: number;
}>;

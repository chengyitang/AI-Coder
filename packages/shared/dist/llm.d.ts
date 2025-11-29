export declare class LLMTracker {
    private static instance;
    private totalTokens;
    private apiCalls;
    private constructor();
    static getInstance(): LLMTracker;
    trackUsage(tokens: number): void;
    getUsage(): {
        totalTokens: number;
        apiCalls: number;
    };
}

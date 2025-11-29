// Name: AI Agent
// Student ID: 000000

export class LLMTracker {
    private static instance: LLMTracker;
    private totalTokens: number = 0;
    private apiCalls: number = 0;

    private constructor() { }

    public static getInstance(): LLMTracker {
        if (!LLMTracker.instance) {
            LLMTracker.instance = new LLMTracker();
        }
        return LLMTracker.instance;
    }

    public trackUsage(tokens: number) {
        this.totalTokens += tokens;
        this.apiCalls++;
    }

    public getUsage() {
        return {
            totalTokens: this.totalTokens,
            apiCalls: this.apiCalls,
        };
    }
}

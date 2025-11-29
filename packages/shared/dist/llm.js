"use strict";
// Name: AI Agent
// Student ID: 000000
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMTracker = void 0;
class LLMTracker {
    constructor() {
        this.totalTokens = 0;
        this.apiCalls = 0;
    }
    static getInstance() {
        if (!LLMTracker.instance) {
            LLMTracker.instance = new LLMTracker();
        }
        return LLMTracker.instance;
    }
    trackUsage(tokens) {
        this.totalTokens += tokens;
        this.apiCalls++;
    }
    getUsage() {
        return {
            totalTokens: this.totalTokens,
            apiCalls: this.apiCalls,
        };
    }
}
exports.LLMTracker = LLMTracker;

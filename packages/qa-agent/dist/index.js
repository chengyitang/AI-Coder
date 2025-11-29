"use strict";
// Name: AI Agent
// Student ID: 000000
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
const server = new index_js_1.Server({
    name: "qa-agent",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "generate_tests",
                description: "Generates tests based on code",
                inputSchema: {
                    type: "object",
                    properties: {
                        code: { type: "string" },
                        language: { type: "string" },
                    },
                    required: ["code", "language"],
                },
            },
        ],
    };
});
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    if (request.params.name === "generate_tests") {
        const { code, language } = request.params.arguments;
        try {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "You are an expert QA engineer. Generate comprehensive unit tests for the provided code. Return a JSON object with a single field 'tests' containing the test code. Ensure the code is properly formatted with newline characters (\\n) for readability. Do not include markdown formatting.",
                    },
                    {
                        role: "user",
                        content: `Code:\n${code}\n\nLanguage: ${language}`,
                    },
                ],
                model: "gpt-4o",
                response_format: { type: "json_object" },
            });
            const responseContent = completion.choices[0].message.content || "{}";
            let parsedResponse;
            try {
                parsedResponse = JSON.parse(responseContent);
            }
            catch (e) {
                parsedResponse = { tests: "// Failed to parse LLM response" };
            }
            const { tests } = parsedResponse;
            const usage = completion.usage;
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            tests,
                            usage: {
                                tokens: usage?.total_tokens || 0,
                                calls: 1,
                            },
                        }),
                    },
                ],
            };
        }
        catch (error) {
            console.error("OpenAI API Error:", error);
            throw new Error("Failed to generate tests via LLM");
        }
    }
    throw new Error("Tool not found");
});
async function run() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error("QA Agent running on stdio");
}
run().catch((error) => {
    console.error("Fatal error in main loop", error);
    process.exit(1);
});

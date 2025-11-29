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
    name: "coder-agent",
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
                name: "generate_code",
                description: "Generates code based on description and requirements",
                inputSchema: {
                    type: "object",
                    properties: {
                        description: { type: "string" },
                        requirements: { type: "string" },
                    },
                    required: ["description", "requirements"],
                },
            },
        ],
    };
});
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    if (request.params.name === "generate_code") {
        const { description, requirements } = request.params.arguments;
        try {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "You are an expert software engineer. Generate clean, well-documented code based on the user's description and requirements. Return a JSON object with two fields: 'code' (the generated source code) and 'language' (the programming language used, e.g., 'python', 'javascript'). Do not include markdown formatting.",
                    },
                    {
                        role: "user",
                        content: `Description: ${description}\nRequirements: ${requirements}`,
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
                parsedResponse = { code: "// Failed to parse LLM response", language: "unknown" };
            }
            const { code, language } = parsedResponse;
            const usage = completion.usage;
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            code,
                            language: language || "unknown",
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
            throw new Error("Failed to generate code via LLM");
        }
    }
    throw new Error("Tool not found");
});
async function run() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error("Coder Agent running on stdio");
}
run().catch((error) => {
    console.error("Fatal error in main loop", error);
    process.exit(1);
});

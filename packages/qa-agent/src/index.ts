// Name: AI Agent
// Student ID: 000000

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";

// Load .env from root directory
// When compiled, __dirname will be in dist/, so go up 3 levels to reach root
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const server = new Server(
    {
        name: "qa-agent",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
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

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === "generate_tests") {
        const { code, language } = request.params.arguments as any;

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
            } catch (e) {
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
        } catch (error) {
            console.error("OpenAI API Error:", error);
            throw new Error("Failed to generate tests via LLM");
        }
    }
    throw new Error("Tool not found");
});

async function run() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("QA Agent running on stdio");
}

run().catch((error) => {
    console.error("Fatal error in main loop", error);
    process.exit(1);
});

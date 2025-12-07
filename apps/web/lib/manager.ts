// Name: AI Agent
// Student ID: 000000

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "path";

export class ManagerAgent {
    private coderClient: Client;
    private qaClient: Client;
    private coderTransport: StdioClientTransport | null = null;
    private qaTransport: StdioClientTransport | null = null;

    constructor() {
        this.coderClient = new Client(
            {
                name: "manager-coder-client",
                version: "1.0.0",
            },
            {
                capabilities: {},
            }
        );

        this.qaClient = new Client(
            {
                name: "manager-qa-client",
                version: "1.0.0",
            },
            {
                capabilities: {},
            }
        );
    }

    async connect() {
        this.coderTransport = new StdioClientTransport({
            command: "node",
            args: [
                path.resolve(
                    process.cwd(),
                    "../../packages/coder-agent/dist/index.js"
                ),
            ],
        });

        this.qaTransport = new StdioClientTransport({
            command: "node",
            args: [
                path.resolve(process.cwd(), "../../packages/qa-agent/dist/index.js"),
            ],
        });

        await this.coderClient.connect(this.coderTransport);
        await this.qaClient.connect(this.qaTransport);
    }

    async disconnect() {
        try {
            await this.coderClient.close();
            await this.qaClient.close();
        } catch (error) {
            console.error("Error closing MCP connections:", error);
        }
    }

    async generateSoftware(description: string, requirements: string) {
        // 1. Call Coder Agent
        const coderResult = await this.coderClient.callTool({
            name: "generate_code",
            arguments: {
                description,
                requirements,
            },
        }) as any;

        const coderContent = coderResult.content[0] as any;
        const { code, language, usage: coderUsage } = JSON.parse(coderContent.text);

        // 2. Call QA Agent
        const qaResult = await this.qaClient.callTool({
            name: "generate_tests",
            arguments: {
                code,
                language,
            },
        }) as any;

        const qaContent = qaResult.content[0] as any;
        const { tests, usage: qaUsage } = JSON.parse(qaContent.text);

        return {
            code,
            tests,
            language,
            usage: {
                coderAgent: {
                    tokens: coderUsage?.tokens || 0,
                    calls: coderUsage?.calls || 0,
                },
                qaAgent: {
                    tokens: qaUsage?.tokens || 0,
                    calls: qaUsage?.calls || 0,
                },
                total: {
                    tokens: (coderUsage?.tokens || 0) + (qaUsage?.tokens || 0),
                    calls: (coderUsage?.calls || 0) + (qaUsage?.calls || 0),
                },
            },
        };
    }
}

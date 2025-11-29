// Name: AI Agent
// Student ID: 000000

import { NextResponse } from "next/server";
import { ManagerAgent } from "@/lib/manager";

export async function POST(request: Request) {
    try {
        const { description, requirements } = await request.json();

        const manager = new ManagerAgent();
        await manager.connect();

        const result = await manager.generateSoftware(description, requirements);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error generating software:", error);
        return NextResponse.json(
            { error: "Failed to generate software" },
            { status: 500 }
        );
    }
}

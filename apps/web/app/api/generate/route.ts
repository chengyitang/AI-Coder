// Name: Cheng-Yi Tang, Shih-Cheng Lu, Han Wang, Jiazhao Lou
// Student ID: 77646578, 31864588, 23322916, 65305787

import { NextResponse } from "next/server";
import { ManagerAgent } from "@/lib/manager";

export async function POST(request: Request) {
    const manager = new ManagerAgent();
    
    try {
        const { description, requirements } = await request.json();

        await manager.connect();

        const result = await manager.generateSoftware(description, requirements);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error generating software:", error);
        return NextResponse.json(
            { error: "Failed to generate software" },
            { status: 500 }
        );
    } finally {
        // Always close MCP connections to prevent resource leaks
        await manager.disconnect();
    }
}

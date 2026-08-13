import { NextResponse } from "next/server";
import connectDB from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({
      ok: true,
      service: "collabdocs-api",
      mongo: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown database error";
    return NextResponse.json(
      {
        ok: false,
        service: "collabdocs-api",
        mongo: "error",
        error: message,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/screenshots — list all
export async function GET() {
  try {
    const shots = await db.screenshot.findMany({
      orderBy: { createdAt: "desc" },
      include: { folder: true },
    });
    return NextResponse.json({ screenshots: shots });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST /api/screenshots — create
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const shot = await db.screenshot.create({
      data: {
        title: body.title || "Untitled",
        dataUrl: body.dataUrl || "",
        captureType: body.captureType || "visible",
        width: body.width || 1280,
        height: body.height || 800,
        sizeBytes: body.sizeBytes || 0,
        aiBlurApplied: !!body.aiBlurApplied,
        starred: !!body.starred,
        tags: Array.isArray(body.tags) ? body.tags.join(",") : (body.tags || ""),
        userId: body.userId || "guest",
        folderId: body.folderId || null,
      },
    });
    return NextResponse.json({ screenshot: shot });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

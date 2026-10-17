import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// DELETE /api/screenshots/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await db.screenshot.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PATCH /api/screenshots/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const updated = await db.screenshot.update({
      where: { id },
      data: {
        ...body,
        tags: Array.isArray(body.tags) ? body.tags.join(",") : body.tags,
      },
    });
    return NextResponse.json({ screenshot: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

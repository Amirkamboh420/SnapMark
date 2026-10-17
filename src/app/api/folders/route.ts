import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const folders = await db.folder.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ folders });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const folder = await db.folder.create({
    data: {
      name: body.name,
      color: body.color || "emerald",
      userId: body.userId || "guest",
    },
  });
  return NextResponse.json({ folder });
}

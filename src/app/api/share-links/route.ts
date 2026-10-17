import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const links = await db.sharedLink.findMany({
    include: { screenshot: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ links });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const url = `s/${Math.random().toString(36).slice(2, 10)}`;
  const link = await db.sharedLink.create({
    data: {
      url,
      screenshotId: body.screenshotId,
      userId: body.userId || "guest",
      expiryDays: body.expiryDays ?? 7,
      passwordProtect: !!body.passwordProtect,
      password: body.password || null,
      watermark: body.watermark ?? true,
    },
  });
  return NextResponse.json({ link });
}

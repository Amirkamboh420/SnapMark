import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/stats
export async function GET() {
  const [users, screenshots, links, tickets] = await Promise.all([
    db.user.count(),
    db.screenshot.count(),
    db.sharedLink.count(),
    db.supportTicket.count(),
  ]);
  const storageUsed = await db.screenshot.aggregate({ _sum: { sizeBytes: true } });
  const aiLogs = await db.aiBlurLog.groupBy({
    by: ["pattern"],
    _sum: { detected: true },
  });
  return NextResponse.json({
    users,
    screenshots,
    links,
    tickets,
    storageBytes: storageUsed._sum.sizeBytes || 0,
    aiLogs,
  });
}

import { NextRequest, NextResponse } from "next/server";
import { scanTextForSensitive, PATTERN_INFO } from "@/lib/ai-blur";
import { db } from "@/lib/db";

// POST /api/ai-blur
// Body: { text: string }
// Returns detected sensitive patterns + their positions in the text.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text: string = body.text || "";
    const detections = scanTextForSensitive(text);
    const result = detections.map((d) => ({
      pattern: d.type,
      label: d.label,
      match: d.match,
      index: d.index,
      info: PATTERN_INFO[d.type],
    }));

    // Log to DB for the admin AI monitor (best-effort)
    try {
      const counts = result.reduce<Record<string, number>>((acc, r) => {
        acc[r.pattern] = (acc[r.pattern] || 0) + 1;
        return acc;
      }, {});
      for (const [pattern, count] of Object.entries(counts)) {
        await db.aiBlurLog.create({
          data: { pattern, detected: count, falsePositive: false },
        });
      }
    } catch {}

    const patterns = result.reduce<Record<string, number>>((acc, r) => {
      acc[r.pattern] = (acc[r.pattern] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      detected: result,
      count: result.length,
      patterns,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// GET /api/ai-blur — recent AI detection stats
export async function GET() {
  const logs = await db.aiBlurLog.groupBy({
    by: ["pattern"],
    _sum: { detected: true },
    _count: { _all: true },
  });
  return NextResponse.json({ logs });
}

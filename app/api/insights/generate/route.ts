import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { upsertInsight } from "@/lib/db";
import { generateInsightReport } from "@/lib/groq";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { month } = await req.json();
  const targetMonth = month ?? new Date().toISOString().slice(0, 7);
  const report = await generateInsightReport(session.user.id, targetMonth);
  await upsertInsight(session.user.id, targetMonth, report);
  return NextResponse.json({ data: { report } });
}

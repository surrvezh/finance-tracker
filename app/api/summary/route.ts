import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getMonthlySummary, getLast6MonthsSummary } from "@/lib/db";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month") ?? new Date().toISOString().slice(0, 7);
  const [summary, last6] = await Promise.all([
    getMonthlySummary(session.user.id, month),
    getLast6MonthsSummary(session.user.id),
  ]);
  return NextResponse.json({ data: { summary, last6 } });
}

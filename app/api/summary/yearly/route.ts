import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getYearlySummary, getAllMonthsInYear } from "@/lib/db";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const year = searchParams.get("year") ?? new Date().getFullYear().toString();
  if (!/^\d{4}$/.test(year)) {
    return NextResponse.json({ error: "Invalid year format. Use YYYY." }, { status: 400 });
  }
  const [summary, allMonths] = await Promise.all([
    getYearlySummary(session.user.id, year),
    getAllMonthsInYear(session.user.id, year),
  ]);
  return NextResponse.json({ data: { summary, allMonths } });
}

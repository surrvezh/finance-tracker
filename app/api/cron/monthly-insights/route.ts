import { NextResponse } from "next/server";
import { getDb, upsertInsight } from "@/lib/db";
import { generateInsightReport } from "@/lib/groq";

export async function GET(req: Request) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const users = await db.execute(`SELECT id FROM users`);

  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const month = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, "0")}`;

  const results = [];
  for (const row of users.rows) {
    const userId = (row as any).id;
    const report = await generateInsightReport(userId, month);
    await upsertInsight(userId, month, report);
    results.push(userId);
  }

  return NextResponse.json({ data: { processed: results.length, month } });
}

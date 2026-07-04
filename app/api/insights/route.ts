import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getInsight } from "@/lib/db";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month") ?? new Date().toISOString().slice(0, 7);
  const data = await getInsight(session.user.id, month);
  return NextResponse.json({ data });
}

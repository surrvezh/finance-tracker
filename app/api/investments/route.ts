import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createInvestment, getInvestments } from "@/lib/db";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month") ?? new Date().toISOString().slice(0, 7);
  const data = await getInvestments(session.user.id, month);
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { fund_name, amount, date, note } = await req.json();
  if (!fund_name || !amount || !date) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const id = await createInvestment(session.user.id, fund_name, Number(amount), date, note ?? null);
  return NextResponse.json({ data: { id } }, { status: 201 });
}

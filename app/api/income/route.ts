import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createIncome, getIncome } from "@/lib/db";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month") ?? new Date().toISOString().slice(0, 7);
  const data = await getIncome(session.user.id, month);
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { account_id, source, amount, date, note } = await req.json();
  if (!account_id || !source || amount == null || amount === "" || !date) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const id = await createIncome(session.user.id, account_id, source, Number(amount), date, note ?? null);
  return NextResponse.json({ data: { id } }, { status: 201 });
}

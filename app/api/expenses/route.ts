import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createExpense, getExpenses } from "@/lib/db";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month") ?? new Date().toISOString().slice(0, 7);
  const data = await getExpenses(session.user.id, month);
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { account_id, category_id, amount, date, note } = await req.json();
  if (!account_id || !category_id || !amount || !date) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const id = await createExpense(session.user.id, account_id, category_id, Number(amount), date, note ?? null);
  return NextResponse.json({ data: { id } }, { status: 201 });
}

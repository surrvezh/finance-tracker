import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateExpense, deleteExpense } from "@/lib/db";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { account_id, category_id, amount, date, note } = await req.json();
  if (!account_id || !category_id || !date || amount == null || amount === "" || isNaN(Number(amount))) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }
  await updateExpense(params.id, session.user.id, account_id, category_id, Number(amount), date, note ?? null);
  return NextResponse.json({ data: { success: true } });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await deleteExpense(params.id, session.user.id);
  return NextResponse.json({ data: { success: true } });
}

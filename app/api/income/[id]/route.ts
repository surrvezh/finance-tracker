import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateIncome, deleteIncome } from "@/lib/db";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { account_id, source, amount, date, note } = await req.json();
  if (!account_id || !source || !date || amount == null || amount === "" || isNaN(Number(amount))) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }
  await updateIncome(params.id, session.user.id, account_id, source, Number(amount), date, note ?? null);
  return NextResponse.json({ data: { success: true } });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await deleteIncome(params.id, session.user.id);
  return NextResponse.json({ data: { success: true } });
}

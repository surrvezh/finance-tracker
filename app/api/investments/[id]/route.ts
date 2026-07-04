import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateInvestment, deleteInvestment } from "@/lib/db";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { fund_name, amount, date, note } = await req.json();
  if (!fund_name || !date || amount == null || amount === "" || isNaN(Number(amount))) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }
  await updateInvestment(params.id, session.user.id, fund_name, Number(amount), date, note ?? null);
  return NextResponse.json({ data: { success: true } });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await deleteInvestment(params.id, session.user.id);
  return NextResponse.json({ data: { success: true } });
}

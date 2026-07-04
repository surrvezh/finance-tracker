import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateCategory, deleteCategory } from "@/lib/db";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name, icon, color, budget_limit, budget_enabled } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });
  await updateCategory(params.id, session.user.id, name.trim(), icon ?? null, color ?? null, budget_limit ?? null, budget_enabled ?? 0);
  return NextResponse.json({ data: { success: true } });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await deleteCategory(params.id, session.user.id);
  return NextResponse.json({ data: { success: true } });
}

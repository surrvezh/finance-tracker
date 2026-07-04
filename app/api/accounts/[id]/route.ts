import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateAccount, deleteAccount } from "@/lib/db";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name, description } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });
  await updateAccount(params.id, session.user.id, name.trim(), description ?? null);
  return NextResponse.json({ data: { success: true } });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await deleteAccount(params.id, session.user.id);
  return NextResponse.json({ data: { success: true } });
}

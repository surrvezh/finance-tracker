import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAccounts, createAccount } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await getAccounts(session.user.id);
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name, description } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const id = await createAccount(session.user.id, name.trim(), description ?? null);
  return NextResponse.json({ data: { id } }, { status: 201 });
}

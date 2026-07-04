import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCategories, createCategory } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await getCategories(session.user.id);
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name, icon, color } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const id = await createCategory(session.user.id, name.trim(), icon ?? null, color ?? null);
  return NextResponse.json({ data: { id } }, { status: 201 });
}

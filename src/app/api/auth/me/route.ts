import { NextResponse } from "next/server";
import { getCurrentUser, destroySession } from "@/lib/server/auth";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user });
}

export async function DELETE() {
  await destroySession();
  return NextResponse.json({ message: "خروج موفقیت‌آمیز" });
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/auth";

// List all users
export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      phone: true,
      name: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true, reviews: true } },
    },
  });

  return NextResponse.json({ users });
}

// Update user role
export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("id");
  if (!userId) {
    return NextResponse.json({ error: "شناسه کاربر الزامی است" }, { status: 400 });
  }

  const body = await req.json();
  const role = body.role;
  if (!["CUSTOMER", "ADMIN"].includes(role)) {
    return NextResponse.json({ error: "نقش نامعتبر است" }, { status: 400 });
  }

  const user = await db.user.update({
    where: { id: userId },
    data: { role },
  });

  return NextResponse.json({ user: { id: user.id, role: user.role } });
}

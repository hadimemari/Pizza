import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { requireAuth } from "@/lib/server/auth";
import { profileUpdateSchema } from "@/lib/server/validations";

// GET /api/profile - دریافت پروفایل کامل
export async function GET() {
  try {
    const authUser = await requireAuth();

    const user = await db.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        birthDate: true,
        avatarUrl: true,
        allergies: true,
        spicePreference: true,
        defaultOrderNote: true,
        loyaltyPoints: true,
        loyaltyTier: true,
        totalOrders: true,
        totalSpent: true,
        referralCode: true,
        smsOptIn: true,
        preferredPayment: true,
        createdAt: true,
        lastOrderAt: true,
        addresses: {
          orderBy: { isDefault: "desc" },
        },
        favorites: {
          include: {
            items: {
              include: {
                product: {
                  select: { id: true, name: true, price: true, image: true, isAvailable: true },
                },
              },
            },
          },
          orderBy: { updatedAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    // محاسبه درصد تکمیل پروفایل
    let completeness = 0;
    if (user.name && user.name !== "کاربر") completeness += 15;
    if (user.addresses.length > 0) completeness += 25;
    if (user.email) completeness += 10;
    if (user.birthDate) completeness += 10;
    if (user.allergies) completeness += 10;
    if (user.spicePreference) completeness += 5;
    if (user.avatarUrl) completeness += 10;
    if (user.totalOrders > 0) completeness += 15;

    return NextResponse.json({ user, completeness });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "وارد حساب خود شوید" }, { status: 401 });
    }
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

// PATCH /api/profile - ویرایش پروفایل
export async function PATCH(req: NextRequest) {
  try {
    const authUser = await requireAuth();
    const body = await req.json();
    const parsed = profileUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Sanitize: حذف فیلدهای خالی
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email || null;
    if (data.birthDate !== undefined) updateData.birthDate = data.birthDate || null;
    if (data.allergies !== undefined) updateData.allergies = data.allergies || null;
    if (data.spicePreference !== undefined) updateData.spicePreference = data.spicePreference;
    if (data.defaultOrderNote !== undefined) updateData.defaultOrderNote = data.defaultOrderNote || null;
    if (data.smsOptIn !== undefined) updateData.smsOptIn = data.smsOptIn;
    if (data.preferredPayment !== undefined) updateData.preferredPayment = data.preferredPayment;

    const user = await db.user.update({
      where: { id: authUser.id },
      data: updateData,
      select: {
        id: true, phone: true, name: true, email: true,
        birthDate: true, allergies: true, spicePreference: true,
        defaultOrderNote: true, smsOptIn: true, preferredPayment: true,
      },
    });

    return NextResponse.json({ message: "پروفایل بروزرسانی شد", user });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "وارد حساب خود شوید" }, { status: 401 });
    }
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

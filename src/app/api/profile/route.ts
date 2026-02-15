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
        firstName: true,
        lastName: true,
        email: true,
        birthYear: true,
        birthMonth: true,
        birthDay: true,
        avatarUrl: true,
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
    if (user.firstName) completeness += 15;
    if (user.lastName) completeness += 10;
    if (user.addresses.length > 0) completeness += 25;
    if (user.email) completeness += 15;
    if (user.birthYear && user.birthMonth && user.birthDay) completeness += 10;
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
    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.email !== undefined) updateData.email = data.email || null;
    if (data.birthYear !== undefined) updateData.birthYear = data.birthYear;
    if (data.birthMonth !== undefined) updateData.birthMonth = data.birthMonth;
    if (data.birthDay !== undefined) updateData.birthDay = data.birthDay;
    if (data.defaultOrderNote !== undefined) updateData.defaultOrderNote = data.defaultOrderNote || null;
    if (data.smsOptIn !== undefined) updateData.smsOptIn = data.smsOptIn;
    if (data.preferredPayment !== undefined) updateData.preferredPayment = data.preferredPayment;

    // Compute display name
    const fn = data.firstName ?? (await db.user.findUnique({ where: { id: authUser.id }, select: { firstName: true } }))?.firstName;
    const ln = data.lastName ?? (await db.user.findUnique({ where: { id: authUser.id }, select: { lastName: true } }))?.lastName;
    if (fn || ln) {
      updateData.name = [fn, ln].filter(Boolean).join(" ");
    }

    // Compute birthDate string
    if (data.birthYear && data.birthMonth && data.birthDay) {
      updateData.birthDate = `${data.birthYear}/${String(data.birthMonth).padStart(2, "0")}/${String(data.birthDay).padStart(2, "0")}`;
    }

    const user = await db.user.update({
      where: { id: authUser.id },
      data: updateData,
      select: {
        id: true, phone: true, name: true, firstName: true, lastName: true,
        email: true, birthYear: true, birthMonth: true, birthDay: true,
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

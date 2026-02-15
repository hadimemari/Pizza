import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { requireAuth } from "@/lib/server/auth";
import { addressSchema } from "@/lib/server/validations";

const MAX_ADDRESSES = 5;

// GET /api/addresses - لیست آدرس‌ها
export async function GET() {
  try {
    const user = await requireAuth();

    const addresses = await db.address.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
    });

    return NextResponse.json({ addresses });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "وارد حساب خود شوید" }, { status: 401 });
    }
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

// POST /api/addresses - افزودن آدرس جدید
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const parsed = addressSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    // بررسی سقف تعداد آدرس
    const count = await db.address.count({ where: { userId: user.id } });
    if (count >= MAX_ADDRESSES) {
      return NextResponse.json(
        { error: `حداکثر ${MAX_ADDRESSES} آدرس مجاز است` },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // اگر اولین آدرس است، پیش‌فرض شود
    const isFirst = count === 0;

    // اگر این آدرس پیش‌فرض شد، بقیه را غیرفعال کن
    if (data.isDefault || isFirst) {
      await db.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }

    const address = await db.address.create({
      data: {
        title: data.title,
        province: data.province ?? "تهران",
        city: data.city ?? "تهران",
        neighborhood: data.neighborhood,
        street: data.street,
        postalCode: data.postalCode || null,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        receiverName: data.receiverName || null,
        receiverPhone: data.receiverPhone || null,
        isDefault: data.isDefault || isFirst,
        userId: user.id,
      },
    });

    return NextResponse.json({ message: "آدرس اضافه شد", address }, { status: 201 });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "وارد حساب خود شوید" }, { status: 401 });
    }
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

// PATCH /api/addresses?id=xxx - ویرایش آدرس
export async function PATCH(req: NextRequest) {
  try {
    const user = await requireAuth();
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "شناسه آدرس الزامی است" }, { status: 400 });
    }

    // بررسی مالکیت
    const existing = await db.address.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "آدرس یافت نشد" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = addressSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = parsed.data;

    if (data.isDefault) {
      await db.address.updateMany({
        where: { userId: user.id, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const address = await db.address.update({
      where: { id },
      data: {
        title: data.title,
        province: data.province ?? "تهران",
        city: data.city ?? "تهران",
        neighborhood: data.neighborhood,
        street: data.street,
        postalCode: data.postalCode || null,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        receiverName: data.receiverName || null,
        receiverPhone: data.receiverPhone || null,
        isDefault: data.isDefault ?? existing.isDefault,
      },
    });

    return NextResponse.json({ message: "آدرس بروزرسانی شد", address });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "وارد حساب خود شوید" }, { status: 401 });
    }
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

// DELETE /api/addresses?id=xxx - حذف آدرس
export async function DELETE(req: NextRequest) {
  try {
    const user = await requireAuth();
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "شناسه آدرس الزامی است" }, { status: 400 });
    }

    const existing = await db.address.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "آدرس یافت نشد" }, { status: 404 });
    }

    await db.address.delete({ where: { id } });

    // اگر آدرس پیش‌فرض حذف شد، اولین آدرس باقیمانده را پیش‌فرض کن
    if (existing.isDefault) {
      const first = await db.address.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "asc" },
      });
      if (first) {
        await db.address.update({ where: { id: first.id }, data: { isDefault: true } });
      }
    }

    return NextResponse.json({ message: "آدرس حذف شد" });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "وارد حساب خود شوید" }, { status: 401 });
    }
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

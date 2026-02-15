import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { requireAuth } from "@/lib/server/auth";
import { favoriteOrderSchema } from "@/lib/server/validations";

const MAX_FAVORITES = 10;

// GET /api/favorites - لیست سفارش‌های همیشگی
export async function GET() {
  try {
    const user = await requireAuth();

    const favorites = await db.favoriteOrder.findMany({
      where: { userId: user.id },
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
    });

    // محاسبه مبلغ کل هر سفارش همیشگی
    const favoritesWithTotal = favorites.map((fav) => ({
      ...fav,
      totalAmount: fav.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
    }));

    return NextResponse.json({ favorites: favoritesWithTotal });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "وارد حساب خود شوید" }, { status: 401 });
    }
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

// POST /api/favorites - ایجاد سفارش همیشگی جدید
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const parsed = favoriteOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const count = await db.favoriteOrder.count({ where: { userId: user.id } });
    if (count >= MAX_FAVORITES) {
      return NextResponse.json(
        { error: `حداکثر ${MAX_FAVORITES} سفارش همیشگی مجاز است` },
        { status: 400 }
      );
    }

    const { title, items } = parsed.data;

    // بررسی وجود محصولات
    const productIds = items.map((i) => i.productId);
    const products = await db.product.findMany({
      where: { id: { in: productIds }, isAvailable: true },
      select: { id: true },
    });

    const validIds = new Set(products.map((p) => p.id));
    const invalidItems = items.filter((i) => !validIds.has(i.productId));
    if (invalidItems.length > 0) {
      return NextResponse.json(
        { error: "برخی محصولات موجود نیستند" },
        { status: 400 }
      );
    }

    const favorite = await db.favoriteOrder.create({
      data: {
        title,
        userId: user.id,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, price: true, image: true, isAvailable: true },
            },
          },
        },
      },
    });

    return NextResponse.json(
      { message: "سفارش همیشگی ذخیره شد", favorite },
      { status: 201 }
    );
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "وارد حساب خود شوید" }, { status: 401 });
    }
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

// DELETE /api/favorites?id=xxx - حذف سفارش همیشگی
export async function DELETE(req: NextRequest) {
  try {
    const user = await requireAuth();
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "شناسه الزامی است" }, { status: 400 });
    }

    const existing = await db.favoriteOrder.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "سفارش همیشگی یافت نشد" }, { status: 404 });
    }

    await db.favoriteOrder.delete({ where: { id } });
    return NextResponse.json({ message: "سفارش همیشگی حذف شد" });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "وارد حساب خود شوید" }, { status: 401 });
    }
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

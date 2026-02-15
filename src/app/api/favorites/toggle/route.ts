import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { requireAuth } from "@/lib/server/auth";

// POST /api/favorites/toggle - toggle favorite for a single product
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "شناسه محصول الزامی است" }, { status: 400 });
    }

    // Check if product exists
    const product = await db.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true },
    });
    if (!product) {
      return NextResponse.json({ error: "محصول یافت نشد" }, { status: 404 });
    }

    // Check if already favorited (a FavoriteOrder with exactly this one product)
    const existing = await db.favoriteOrder.findFirst({
      where: {
        userId: user.id,
        items: { some: { productId } },
      },
      include: { items: true },
    });

    if (existing && existing.items.length === 1 && existing.items[0].productId === productId) {
      // Remove favorite
      await db.favoriteOrder.delete({ where: { id: existing.id } });
      return NextResponse.json({ favorited: false, message: "از علاقه‌مندی‌ها حذف شد" });
    }

    // Add as favorite
    const count = await db.favoriteOrder.count({ where: { userId: user.id } });
    if (count >= 20) {
      return NextResponse.json({ error: "حداکثر ۲۰ علاقه‌مندی مجاز است" }, { status: 400 });
    }

    await db.favoriteOrder.create({
      data: {
        title: product.name,
        userId: user.id,
        items: { create: { productId, quantity: 1 } },
      },
    });

    return NextResponse.json({ favorited: true, message: "به علاقه‌مندی‌ها اضافه شد" });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "وارد حساب خود شوید" }, { status: 401 });
    }
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

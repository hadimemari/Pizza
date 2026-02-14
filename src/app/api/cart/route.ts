import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { requireAuth } from "@/lib/server/auth";
import { cartAddSchema, cartUpdateSchema } from "@/lib/server/validations";

// دریافت سبد خرید
export async function GET() {
  let user;
  try {
    user = await requireAuth();
  } catch {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  const cart = await db.cart.findUnique({
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
  });

  const items = cart?.items || [];
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return NextResponse.json({ items, total });
}

// اضافه کردن به سبد
export async function POST(req: NextRequest) {
  let user;
  try {
    user = await requireAuth();
  } catch {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = cartAddSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const { productId, quantity } = parsed.data;

  // Check product exists and is available
  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product || !product.isAvailable) {
    return NextResponse.json({ error: "محصول موجود نیست" }, { status: 404 });
  }

  // Get or create cart
  let cart = await db.cart.findUnique({ where: { userId: user.id } });
  if (!cart) {
    cart = await db.cart.create({ data: { userId: user.id } });
  }

  // Upsert cart item
  await db.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    create: { cartId: cart.id, productId, quantity },
    update: { quantity: { increment: quantity } },
  });

  return NextResponse.json({ message: "به سبد اضافه شد" });
}

// بروزرسانی تعداد آیتم (quantity=0 حذف میکنه)
export async function PATCH(req: NextRequest) {
  let user;
  try {
    user = await requireAuth();
  } catch {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get("itemId");
  if (!itemId) {
    return NextResponse.json({ error: "شناسه آیتم الزامی است" }, { status: 400 });
  }

  const body = await req.json();
  const parsed = cartUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  // Verify ownership
  const item = await db.cartItem.findFirst({
    where: { id: itemId, cart: { userId: user.id } },
  });

  if (!item) {
    return NextResponse.json({ error: "آیتم یافت نشد" }, { status: 404 });
  }

  if (parsed.data.quantity === 0) {
    await db.cartItem.delete({ where: { id: itemId } });
    return NextResponse.json({ message: "آیتم حذف شد" });
  }

  await db.cartItem.update({
    where: { id: itemId },
    data: { quantity: parsed.data.quantity },
  });

  return NextResponse.json({ message: "بروزرسانی شد" });
}

// پاک کردن کل سبد
export async function DELETE() {
  let user;
  try {
    user = await requireAuth();
  } catch {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  const cart = await db.cart.findUnique({ where: { userId: user.id } });
  if (cart) {
    await db.cartItem.deleteMany({ where: { cartId: cart.id } });
  }

  return NextResponse.json({ message: "سبد خالی شد" });
}

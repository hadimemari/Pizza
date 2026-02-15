import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { requireAuth, requireAdmin } from "@/lib/server/auth";
import { orderCreateSchema, orderStatusSchema } from "@/lib/server/validations";

// دریافت سفارشات (کاربر: سفارشات خودش، ادمین: همه)
export async function GET() {
  let user;
  try {
    user = await requireAuth();
  } catch {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  const where = user.role === "ADMIN" ? {} : { userId: user.id };

  const orders = await db.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: { select: { name: true, image: true } },
        },
      },
      payment: { select: { status: true, gateway: true, refId: true } },
      user: { select: { name: true, phone: true } },
    },
  });

  return NextResponse.json({ orders });
}

// ثبت سفارش جدید (از سبد خرید)
export async function POST(req: NextRequest) {
  let user;
  try {
    user = await requireAuth();
  } catch {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = orderCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  // Get cart with items
  const cart = await db.cart.findUnique({
    where: { userId: user.id },
    include: {
      items: { include: { product: true } },
    },
  });

  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: "سبد خرید خالی است" }, { status: 400 });
  }

  // Check all items are available
  const unavailable = cart.items.filter((i) => !i.product.isAvailable);
  if (unavailable.length > 0) {
    return NextResponse.json(
      { error: `محصول "${unavailable[0].product.name}" فعلاً ناموجود است` },
      { status: 400 }
    );
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.09);
  const deliveryFee = 25000;
  const totalAmount = subtotal + tax + deliveryFee;

  const lastOrder = await db.order.findFirst({ orderBy: { orderNumber: "desc" } });
  const orderNumber = (lastOrder?.orderNumber || 1000) + 1;

  const order = await db.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        orderNumber,
        userId: user.id,
        subtotal,
        tax,
        deliveryFee,
        totalAmount,
        note: parsed.data.note,
        addressId: parsed.data.addressId,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.product.price,
          })),
        },
      },
      include: { items: true },
    });
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    return newOrder;
  });

  return NextResponse.json(
    {
      message: "سفارش با موفقیت ثبت شد",
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        subtotal: order.subtotal,
        tax: order.tax,
        deliveryFee: order.deliveryFee,
        totalAmount: order.totalAmount,
        status: order.status,
      },
    },
    { status: 201 }
  );
}

// بروزرسانی وضعیت سفارش (فقط ادمین)
export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");
  if (!orderId) {
    return NextResponse.json({ error: "شناسه سفارش الزامی است" }, { status: 400 });
  }

  const body = await req.json();
  const parsed = orderStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const order = await db.order.update({
    where: { id: orderId },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({
    message: "وضعیت سفارش بروزرسانی شد",
    order: { id: order.id, status: order.status },
  });
}

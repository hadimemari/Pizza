import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { requireAuth } from "@/lib/server/auth";
import { paymentRequestSchema } from "@/lib/server/validations";

// ──────────────────────────────────────────
// درخواست پرداخت
// آماده‌سازی: وقتی درگاه بانکی وصل شد،
// فقط خط‌های TODO رو جایگزین کنید
// ──────────────────────────────────────────

export async function POST(req: NextRequest) {
  let user;
  try {
    user = await requireAuth();
  } catch {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = paymentRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  // Verify order belongs to user and is pending
  const order = await db.order.findFirst({
    where: {
      id: parsed.data.orderId,
      userId: user.id,
      status: "PENDING",
      payment: null,
    },
  });

  if (!order) {
    return NextResponse.json(
      { error: "سفارش یافت نشد یا قبلا پرداخت شده" },
      { status: 404 }
    );
  }

  // Create payment record
  const payment = await db.payment.create({
    data: {
      orderId: order.id,
      amount: order.totalAmount,
      gateway: "demo", // TODO: "zarinpal" | "idpay"
    },
  });

  // ──────────────────────────────────────
  // TODO: اتصال به درگاه واقعی
  //
  // مثال Zarinpal:
  // const zarinpal = await fetch("https://api.zarinpal.com/pg/v4/payment/request.json", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     merchant_id: process.env.ZARINPAL_MERCHANT_ID,
  //     amount: order.totalAmount * 10, // تومان → ریال
  //     callback_url: `${process.env.NEXTAUTH_URL}/api/payment/verify`,
  //     description: `سفارش #${order.orderNumber}`,
  //   }),
  // });
  //
  // const { data } = await zarinpal.json();
  // redirect to: `https://www.zarinpal.com/pg/StartPay/${data.authority}`
  // ──────────────────────────────────────

  // Demo mode: مستقیم موفق فرض میکنیم
  await db.payment.update({
    where: { id: payment.id },
    data: {
      status: "SUCCESS",
      transactionId: `DEMO-${Date.now()}`,
      refId: `REF-${order.orderNumber}`,
    },
  });

  await db.order.update({
    where: { id: order.id },
    data: { status: "CONFIRMED" },
  });

  return NextResponse.json({
    message: "پرداخت موفق (حالت دمو)",
    payment: {
      id: payment.id,
      status: "SUCCESS",
      refId: `REF-${order.orderNumber}`,
    },
  });
}

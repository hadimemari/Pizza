import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/server/db";

// ──────────────────────────────────────────
// تایید پرداخت (Callback از درگاه بانکی)
// فعلا آماده‌سازی - وقتی درگاه وصل شد فعال میشه
// ──────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // TODO: پارامترها بر اساس درگاه متفاوتند
  // Zarinpal: Authority, Status
  // IDPay: id, order_id, status
  const authority = searchParams.get("Authority");
  const status = searchParams.get("Status");

  if (!authority || status !== "OK") {
    // Redirect to failed page
    return NextResponse.redirect(new URL("/payment/failed", req.url));
  }

  // TODO: Verify with gateway API
  // const verify = await fetch("https://api.zarinpal.com/pg/v4/payment/verify.json", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     merchant_id: process.env.ZARINPAL_MERCHANT_ID,
  //     authority,
  //     amount: payment.amount * 10,
  //   }),
  // });

  // For now, find payment by transactionId
  const payment = await db.payment.findFirst({
    where: { transactionId: authority },
  });

  if (!payment) {
    return NextResponse.redirect(new URL("/payment/failed", req.url));
  }

  // Update payment and order
  await db.payment.update({
    where: { id: payment.id },
    data: { status: "SUCCESS" },
  });

  await db.order.update({
    where: { id: payment.orderId },
    data: { status: "CONFIRMED" },
  });

  return NextResponse.redirect(
    new URL(`/payment/success?ref=${payment.refId}`, req.url)
  );
}

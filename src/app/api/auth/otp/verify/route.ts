import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { createSession } from "@/lib/server/auth";
import { otpVerifySchema } from "@/lib/server/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = otpVerifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { phone, code, name } = parsed.data;

    // Find valid OTP
    const otpRecord = await db.otpCode.findFirst({
      where: {
        phone,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "کد تایید نامعتبر یا منقضی شده" },
        { status: 400 }
      );
    }

    // Mark OTP as used
    await db.otpCode.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    // Find or create user
    let user = await db.user.findUnique({ where: { phone } });

    if (!user) {
      user = await db.user.create({
        data: {
          phone,
          name: name || "کاربر",
        },
      });
    } else if (name && !user.name) {
      user = await db.user.update({
        where: { id: user.id },
        data: { name },
      });
    }

    // Create session
    await createSession(user.id, user.role);

    return NextResponse.json({
      message: "ورود موفقیت‌آمیز",
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "خطای سرور" },
      { status: 500 }
    );
  }
}

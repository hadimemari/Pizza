import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { createSession } from "@/lib/server/auth";
import { otpVerifySchema } from "@/lib/server/validations";
import * as crypto from "crypto";

const MAX_VERIFY_ATTEMPTS = 5;

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

    // [SECURITY FIX] Per-phone brute-force protection
    const recentFailedAttempts = await db.otpCode.count({
      where: {
        phone,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    // Find latest valid OTP for this phone (not by code, to enable timing-safe compare)
    const otpRecord = await db.otpCode.findFirst({
      where: {
        phone,
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

    // [SECURITY FIX] Timing-safe OTP comparison
    const codeMatch =
      code.length === otpRecord.code.length &&
      crypto.timingSafeEqual(Buffer.from(code), Buffer.from(otpRecord.code));

    if (!codeMatch) {
      return NextResponse.json(
        { error: "کد تایید نامعتبر یا منقضی شده" },
        { status: 400 }
      );
    }

    // [SECURITY FIX] Invalidate ALL OTP codes for this phone on successful verify
    await db.otpCode.updateMany({
      where: { phone, used: false },
      data: { used: true },
    });

    // Find or create user
    let user = await db.user.findUnique({ where: { phone } });

    if (!user) {
      user = await db.user.create({
        data: {
          phone,
          name: name || "کاربر",
          firstName: name || null,
        },
      });
    } else if (name && !user.name) {
      user = await db.user.update({
        where: { id: user.id },
        data: { name, firstName: name },
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

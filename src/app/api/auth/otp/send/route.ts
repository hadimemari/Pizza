import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { sendOtp, generateOtpCode } from "@/lib/server/sms";
import { otpSendSchema } from "@/lib/server/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = otpSendSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { phone } = parsed.data;

    // Rate limit: max 3 OTP requests per phone per 10 minutes
    const recentCodes = await db.otpCode.count({
      where: {
        phone,
        createdAt: { gt: new Date(Date.now() - 10 * 60 * 1000) },
      },
    });

    if (recentCodes >= 3) {
      return NextResponse.json(
        { error: "تعداد درخواست بیش از حد مجاز. لطفا ۱۰ دقیقه صبر کنید." },
        { status: 429 }
      );
    }

    const code = generateOtpCode();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    // Find or reference user
    let user = await db.user.findUnique({ where: { phone } });

    await db.otpCode.create({
      data: {
        phone,
        code,
        expiresAt,
        userId: user?.id,
      },
    });

    const sent = await sendOtp(phone, code);

    if (!sent) {
      return NextResponse.json(
        { error: "ارسال پیامک با مشکل مواجه شد. دوباره تلاش کنید." },
        { status: 500 }
      );
    }

    const response: Record<string, unknown> = {
      message: "کد تایید ارسال شد",
      isNewUser: !user,
    };

    // In development, return OTP code in response for testing
    if (process.env.NODE_ENV === "development") {
      response.debug_code = code;
    }

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "خطای سرور" },
      { status: 500 }
    );
  }
}

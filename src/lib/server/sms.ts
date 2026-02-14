// ──────────────────────────────────────────
// sms.ir OTP Integration
// API Docs: https://sms.ir/rest-api/
// ──────────────────────────────────────────

const SMSIR_API_URL = "https://api.sms.ir/v1/send/verify";

interface SmsIrResponse {
  status: number;
  message: string;
  data: {
    messageId: number;
    cost: number;
  } | null;
}

export async function sendOtp(phone: string, code: string): Promise<boolean> {
  const apiKey = process.env.SMSIR_API_KEY;
  const templateId = process.env.SMSIR_TEMPLATE_ID;

  // Demo mode: اگر API key تنظیم نشده، کد رو فقط log میکنیم
  if (!apiKey || !templateId) {
    console.log(`[SMS DEMO] OTP for ${phone}: ${code}`);
    return true;
  }

  try {
    const response = await fetch(SMSIR_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        mobile: phone.replace(/^0/, "98"), // 09xx → 989xx
        templateId: parseInt(templateId),
        parameters: [
          {
            name: "Code",
            value: code,
          },
        ],
      }),
    });

    const result: SmsIrResponse = await response.json();
    return result.status === 1;
  } catch (error) {
    console.error("[SMS ERROR]", error);
    return false;
  }
}

export function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

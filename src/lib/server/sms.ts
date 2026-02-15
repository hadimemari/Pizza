// ──────────────────────────────────────────
// sms.ir OTP Integration
// API Docs: https://app.sms.ir/developer/help/api
// ──────────────────────────────────────────

const SMSIR_BASE = "https://api.sms.ir/v1";

interface SmsIrResponse {
  status: number;
  message: string;
  data: {
    messageId: number;
    cost: number;
  } | null;
}

function getApiKey(): string | null {
  return process.env.SMSIR_API_KEY || null;
}

function getTemplateId(): string | null {
  return process.env.SMSIR_TEMPLATE_ID || null;
}

function toInternational(phone: string): string {
  // 09xx → 989xx (Iranian international format)
  return phone.replace(/^0/, "98");
}

export function isDemoMode(): boolean {
  return !getApiKey() || !getTemplateId();
}

export function isSandboxMode(): boolean {
  return process.env.SMSIR_SANDBOX === "true";
}

export async function sendOtp(phone: string, code: string): Promise<boolean> {
  const apiKey = getApiKey();
  const templateId = getTemplateId();

  // Demo mode: log OTP to console if API key not configured
  if (!apiKey || !templateId) {
    console.log(`\n╔════════════════════════════════════╗`);
    console.log(`║  [SMS DEMO] کد تایید              ║`);
    console.log(`║  Phone: ${phone.padEnd(24)}║`);
    console.log(`║  Code:  ${code.padEnd(24)}║`);
    console.log(`╚════════════════════════════════════╝\n`);
    return true;
  }

  // Retry with backoff for network errors
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(`${SMSIR_BASE}/send/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          mobile: toInternational(phone),
          templateId: parseInt(templateId),
          parameters: [
            { name: "Code", value: code },
          ],
        }),
      });

      const result: SmsIrResponse = await response.json();

      if (result.status === 1) {
        console.log(`[SMS] OTP sent to ${phone} (messageId: ${result.data?.messageId})`);
        return true;
      }

      console.error(`[SMS] Failed to send OTP: ${result.message} (status: ${result.status})`);
      return false;
    } catch (error) {
      console.error(`[SMS] Network error (attempt ${attempt + 1}/3):`, error);
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }

  return false;
}

export async function getCredit(): Promise<number | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  try {
    const response = await fetch(`${SMSIR_BASE}/credit`, {
      headers: { "x-api-key": apiKey },
    });
    const result = await response.json();
    return result.data ?? null;
  } catch {
    return null;
  }
}

export function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

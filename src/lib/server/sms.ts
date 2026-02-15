// ──────────────────────────────────────────
// sms.ir OTP Integration
// API Docs: https://app.sms.ir/developer/help/api
// ──────────────────────────────────────────

const SMSIR_BASE = "https://api.sms.ir/v1";
const SANDBOX_TEMPLATE_ID = 123456;

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

  // In sandbox mode, always use the built-in sandbox template
  const sandbox = isSandboxMode();
  const resolvedTemplateId = sandbox ? SANDBOX_TEMPLATE_ID : parseInt(templateId);

  // Retry with backoff for network errors
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const body = {
        mobile: toInternational(phone),
        templateId: resolvedTemplateId,
        parameters: [
          { name: "Code", value: code },
        ],
      };

      // [SECURITY FIX] Redact OTP code from logs
      const logBody = { ...body, parameters: [{ name: "Code", value: "***" }] };
      console.log(`[SMS] Sending OTP (sandbox=${sandbox}):`, JSON.stringify(logBody));

      const response = await fetch(`${SMSIR_BASE}/send/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "text/plain",
          "x-api-key": apiKey,
        },
        body: JSON.stringify(body),
      });

      const result: SmsIrResponse = await response.json();

      if (result.status === 1) {
        console.log(`[SMS] OTP sent to ${phone} (messageId: ${result.data?.messageId})`);
        return true;
      }

      console.error(`[SMS] Failed to send OTP:`, JSON.stringify(result));
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

// [SECURITY FIX] Use crypto PRNG instead of Math.random()
export function generateOtpCode(): string {
  const { randomInt } = require("crypto");
  return randomInt(100000, 999999).toString();
}

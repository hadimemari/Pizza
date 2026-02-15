import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ──────────────────────────────────────────
// Security Middleware
// ──────────────────────────────────────────

// In-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 60; // 60 requests per minute

// Stricter rate limit for auth endpoints (brute-force protection)
const AUTH_RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes
const AUTH_RATE_LIMIT_MAX = 10; // 10 auth attempts per 10 min
const authRateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

function isAuthRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = authRateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    authRateLimitMap.set(ip, { count: 1, resetAt: now + AUTH_RATE_LIMIT_WINDOW });
    return false;
  }

  entry.count++;
  return entry.count > AUTH_RATE_LIMIT_MAX;
}

// Clean up stale entries periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap) {
      if (now > value.resetAt) rateLimitMap.delete(key);
    }
    for (const [key, value] of authRateLimitMap) {
      if (now > value.resetAt) authRateLimitMap.delete(key);
    }
  }, 60 * 1000);
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // ── Security Headers ──
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  // [SECURITY FIX] HSTS - force HTTPS in production
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  // Prevent caching of API responses with auth data
  if (pathname.startsWith("/api/")) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    response.headers.set("Pragma", "no-cache");
  }

  // ── Rate Limiting ──
  if (pathname.startsWith("/api/")) {
    // [SECURITY FIX] Prefer request.ip; parse only first IP from X-Forwarded-For
    const ip = request.ip || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    // Strict rate limit for auth endpoints
    if (pathname.startsWith("/api/auth/otp/")) {
      if (isAuthRateLimited(ip)) {
        return NextResponse.json(
          { error: "تعداد تلاش بیش از حد مجاز. لطفا ۱۰ دقیقه صبر کنید." },
          { status: 429 }
        );
      }
    }

    // General rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "تعداد درخواست بیش از حد مجاز. لطفا کمی صبر کنید." },
        { status: 429 }
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};

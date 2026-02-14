import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ──────────────────────────────────────────
// Security Middleware
// ──────────────────────────────────────────

// Simple in-memory rate limiter for API routes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 60; // 60 requests per minute

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

// Clean up stale entries periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap) {
      if (now > value.resetAt) rateLimitMap.delete(key);
    }
  }, 60 * 1000);
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // ── Security Headers ──
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // ── Rate Limiting for API routes ──
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const ip = request.headers.get("x-forwarded-for") || request.ip || "unknown";

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
    // Match all routes except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};

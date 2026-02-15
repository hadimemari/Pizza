import { cookies } from "next/headers";
import { db } from "./db";
import * as crypto from "crypto";

// ──────────────────────────────────────────
// JWT-like session with HMAC signing
// Security: HMAC-SHA256, timing-safe compare,
//   idle timeout, secure cookie flags
// ──────────────────────────────────────────

// [SECURITY FIX] Lazy init - validated on first use, not at build time
let _cachedSecret: string | null = null;
function getSecret(): string {
  if (_cachedSecret) return _cachedSecret;
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret || secret.includes("change-me") || secret === "dev-secret") {
    if (process.env.NODE_ENV !== "development") {
      console.error("[AUTH] CRITICAL: Set a strong NEXTAUTH_SECRET in production! Run: openssl rand -base64 32");
    }
    _cachedSecret = secret || "dev-secret-unsafe";
  } else {
    _cachedSecret = secret;
  }
  return _cachedSecret;
}
const SESSION_COOKIE = "session_token";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days (absolute)
const SESSION_IDLE_MAX = 30 * 60; // 30 minutes idle timeout

interface SessionPayload {
  userId: string;
  role: string;
  exp: number;
  iat: number;
  lastActive: number;
}

function sign(payload: SessionPayload): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(data)
    .digest("base64url");
  return `${data}.${signature}`;
}

function verify(token: string): SessionPayload | null {
  try {
    const [data, signature] = token.split(".");
    if (!data || !signature) return null;

    // Timing-safe comparison to prevent timing attacks
    const expectedSig = crypto
      .createHmac("sha256", getSecret())
      .update(data)
      .digest("base64url");

    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return null;
    }

    const payload: SessionPayload = JSON.parse(
      Buffer.from(data, "base64url").toString()
    );

    const now = Date.now();

    // Check absolute expiry
    if (now > payload.exp) return null;

    // Check idle timeout (30 min of inactivity)
    if (payload.lastActive && (now - payload.lastActive) > SESSION_IDLE_MAX * 1000) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// [SECURITY FIX] secure flag defaults to true except in explicit development
function isSecure(): boolean {
  return process.env.NODE_ENV !== "development";
}

export async function createSession(userId: string, role: string) {
  const now = Date.now();
  const payload: SessionPayload = {
    userId,
    role,
    exp: now + SESSION_MAX_AGE * 1000,
    iat: now,
    lastActive: now,
  };

  const token = sign(payload);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isSecure(),
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  // Update user lastActiveAt
  await db.user.update({
    where: { id: userId },
    data: { lastActiveAt: new Date(now) },
  }).catch(() => {});

  return token;
}

export async function getSession(): Promise<{
  userId: string;
  role: string;
} | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = verify(token);
  if (!payload) return null;

  // Sliding window: refresh lastActive on each valid request
  const now = Date.now();
  const refreshed: SessionPayload = { ...payload, lastActive: now };
  const newToken = sign(refreshed);

  cookieStore.set(SESSION_COOKIE, newToken, {
    httpOnly: true,
    secure: isSecure(),
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  return { userId: payload.userId, role: payload.role };
}

// [SECURITY FIX] Always fetch role from DB, not from token
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { id: true, phone: true, name: true, role: true, status: true },
  });

  // Check if user is banned/suspended
  if (!user || user.status !== "ACTIVE") return null;

  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return user;
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

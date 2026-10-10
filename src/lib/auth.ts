import crypto from "crypto";

/**
 * Authentication primitives: PBKDF2 password hashing and HS256 JSON Web Tokens.
 *
 * The signing secret comes from the JWT_SECRET environment variable. Each project
 * (customer / admin) must use its own secret so tokens cannot be replayed across apps.
 */

const PBKDF2_ITERATIONS = 1000; // Must stay in sync with existing stored hashes.
const PBKDF2_KEY_LENGTH = 64;
const PBKDF2_DIGEST = "sha512";

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
  permissions?: string[];
  exp?: number;
  iat?: number;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim() === "") {
    throw new Error("JWT_SECRET is not configured. Add it to your .env.local file.");
  }
  return secret;
}

// ─── Password hashing ────────────────────────────────────────────────────────

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const actualSalt = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, actualSalt, PBKDF2_ITERATIONS, PBKDF2_KEY_LENGTH, PBKDF2_DIGEST)
    .toString("hex");
  return { hash, salt: actualSalt };
}

export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  if (!salt || !expectedHash) return false;
  const { hash } = hashPassword(password, salt);
  const a = Buffer.from(hash);
  const b = Buffer.from(expectedHash);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// ─── JWT (HS256) ─────────────────────────────────────────────────────────────

function base64UrlEncode(input: string | Buffer): string {
  return Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64UrlDecode(input: string): string {
  let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) base64 += "=";
  return Buffer.from(base64, "base64").toString("utf-8");
}

function sign(data: string): string {
  return base64UrlEncode(crypto.createHmac("sha256", getJwtSecret()).update(data).digest());
}

export function signJWT(payload: JWTPayload, expiresInSeconds: number = 86400): string {
  const now = Math.floor(Date.now() / 1000);
  const { exp, iat, ...claims } = payload;
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64UrlEncode(JSON.stringify({ ...claims, iat: now, exp: now + expiresInSeconds }));
  return `${header}.${body}.${sign(`${header}.${body}`)}`;
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;
    const expected = sign(`${header}.${body}`);
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

    const payload: JWTPayload = JSON.parse(base64UrlDecode(body));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Sliding-window renewal: re-issues a valid token with a fresh expiry. */
export function renewSession(token: string, expiresInSeconds: number = 86400): string | null {
  const payload = verifyJWT(token);
  return payload ? signJWT(payload, expiresInSeconds) : null;
}

/** Reads and verifies the `Authorization: Bearer <token>` header. */
export function getBearerPayload(req: Request): JWTPayload | null {
  const header = req.headers.get("authorization");
  if (!header || !header.startsWith("Bearer ")) return null;
  return verifyJWT(header.slice(7).trim());
}

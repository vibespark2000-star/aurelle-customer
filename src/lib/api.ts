import { NextResponse } from "next/server";
import { getBearerPayload, type JWTPayload } from "@/lib/auth";

/** Standard JSON success envelope: `{ success: true, ...body }`. */
export function ok(body: Record<string, unknown> = {}, status = 200) {
  return NextResponse.json({ success: true, ...body }, { status });
}

/** Standard JSON error envelope: `{ success: false, error }`. */
export function fail(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

export function errorMessage(err: unknown, fallback = "Unexpected server error."): string {
  return err instanceof Error && err.message ? err.message : fallback;
}

/** Returns the signed-in customer's token payload, or null when absent/invalid. */
export function getCustomerSession(req: Request): JWTPayload | null {
  return getBearerPayload(req);
}

/** Normalises a phone number to its last 10 digits for loose matching. */
export function phoneTail(phone?: string | null): string {
  return phone ? phone.replace(/\D/g, "").slice(-10) : "";
}

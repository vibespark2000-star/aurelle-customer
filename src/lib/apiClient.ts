/**
 * Browser-side fetch wrapper for this app's API routes.
 * Automatically attaches the signed-in customer's token so protected routes
 * (profile, my bookings, my support tickets) can identify the caller.
 */
export const CUSTOMER_TOKEN_KEY = "aurelle_customer_token";
export const CUSTOMER_USER_KEY = "aurelle_customer_user";

export function getStoredCustomerToken(): string | null {
  try {
    return typeof window === "undefined" ? null : localStorage.getItem(CUSTOMER_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  const token = getStoredCustomerToken();
  if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && typeof init.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(path, { ...init, headers });
}

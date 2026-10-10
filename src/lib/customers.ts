/** Shape of the customer profile returned to the browser (never includes password data). */
export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  profilePic: string;
  role: string;
}

/** Maps a Mongo user document or memory-store user to the public customer profile. */
export function toCustomerProfile(user: any): CustomerProfile {
  return {
    id: user._id ? user._id.toString() : user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    address: user.address || "",
    profilePic: user.profilePic || user.profilePhoto || "",
    role: user.role || "customer",
  };
}

/** Customer sessions last 30 days. */
export const CUSTOMER_TOKEN_TTL_SECONDS = 86400 * 30;

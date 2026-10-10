import { connectToDatabase } from "@/lib/db";
import { UserModel } from "@/lib/models";
import { hashPassword, signJWT } from "@/lib/auth";
import { memoryStore } from "@/lib/memoryStore";
import { ok, fail, errorMessage } from "@/lib/api";
import { toCustomerProfile, CUSTOMER_TOKEN_TTL_SECONDS } from "@/lib/customers";

/** POST /api/auth/customer/register — create a customer account and sign in. */
export async function POST(req: Request) {
  try {
    const { name, email, phone, password, address, profilePic } = await req.json();

    if (!name?.trim()) return fail("Full Name is required.");
    if (!phone?.trim()) return fail("Phone number is required.");
    if (!email?.trim()) return fail("Email address is required.");
    if (!password || String(password).trim().length < 4) {
      return fail("Password must be at least 4 characters.");
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPhone = String(phone).trim();
    const { hash, salt } = hashPassword(password);
    const newUser = {
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      address: address ? address.trim() : "",
      profilePic: profilePic || "",
      profilePhoto: profilePic || "",
      passwordHash: hash,
      salt,
      role: "customer",
      isActive: true,
    };

    const db = await connectToDatabase();
    let created: any;

    if (db) {
      const existing = await UserModel.findOne({ $or: [{ email: cleanEmail }, { phone: cleanPhone }] });
      if (existing) return fail("An account with this email or phone number already exists.");
      created = await UserModel.create(newUser);
    } else {
      if (memoryStore.findUserByEmailOrPhone(cleanEmail, cleanPhone)) {
        return fail("An account with this email or phone number already exists.");
      }
      created = memoryStore.addUser(newUser);
    }

    const profile = toCustomerProfile(created);
    const token = signJWT(
      { userId: profile.id, email: profile.email, name: profile.name, role: "customer" },
      CUSTOMER_TOKEN_TTL_SECONDS
    );

    return ok({ message: "Account created successfully!", token, user: profile }, 201);
  } catch (err) {
    console.error("Customer registration error:", err);
    return fail(errorMessage(err, "Failed to register account."), 500);
  }
}

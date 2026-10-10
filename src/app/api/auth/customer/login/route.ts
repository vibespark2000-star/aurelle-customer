import { connectToDatabase } from "@/lib/db";
import { UserModel } from "@/lib/models";
import { verifyPassword, signJWT } from "@/lib/auth";
import { memoryStore } from "@/lib/memoryStore";
import { ok, fail, errorMessage } from "@/lib/api";
import { toCustomerProfile, CUSTOMER_TOKEN_TTL_SECONDS } from "@/lib/customers";

/** POST /api/auth/customer/login — sign in with email or phone + password. */
export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();
    if (!identifier || !password) {
      return fail("Email/Phone and Password are required.", 400);
    }

    const cleanIdentifier = String(identifier).trim().toLowerCase();
    const db = await connectToDatabase();

    const user: any = db
      ? await UserModel.findOne({
          $or: [{ email: cleanIdentifier }, { phone: cleanIdentifier }, { phone: identifier }],
        })
      : memoryStore.findUserByEmailOrPhone(cleanIdentifier, cleanIdentifier);

    if (!user || !verifyPassword(password, user.salt, user.passwordHash)) {
      return fail("Invalid Email/Phone or password.", 401);
    }
    if (user.isActive === false) {
      return fail("Account disabled. Please contact support desk.", 403);
    }

    if (db) {
      user.lastLogin = new Date();
      await user.save();
    }

    const profile = toCustomerProfile(user);
    const token = signJWT(
      { userId: profile.id, email: profile.email, name: profile.name, role: profile.role },
      CUSTOMER_TOKEN_TTL_SECONDS
    );

    return ok({ message: "Logged in successfully!", token, user: profile });
  } catch (err) {
    console.error("Customer login error:", err);
    return fail(errorMessage(err, "Login failed."), 500);
  }
}

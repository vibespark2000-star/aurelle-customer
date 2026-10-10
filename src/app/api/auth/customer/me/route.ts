import { connectToDatabase } from "@/lib/db";
import { UserModel, BookingModel } from "@/lib/models";
import { memoryStore } from "@/lib/memoryStore";
import { ok, fail, errorMessage, getCustomerSession, phoneTail } from "@/lib/api";
import { toCustomerProfile } from "@/lib/customers";

export const dynamic = "force-dynamic";

/** GET /api/auth/customer/me — the signed-in customer's profile and bookings. */
export async function GET(req: Request) {
  try {
    const session = getCustomerSession(req);
    if (!session?.userId) return fail("Please sign in to view your account.", 401);

    const db = await connectToDatabase();

    if (db) {
      const user = await UserModel.findById(session.userId, "-passwordHash -salt").catch(() => null);
      if (user) {
        const filters: any[] = [{ userId: user._id.toString() }];
        if (user.email) filters.push({ email: user.email.trim().toLowerCase() });
        if (user.phone) filters.push({ phone: user.phone });
        const tail = phoneTail(user.phone);
        if (tail) filters.push({ phone: { $regex: tail } });

        const bookings = await BookingModel.find({ $or: filters }).sort({ createdAt: -1 }).lean();
        return ok({ user: toCustomerProfile(user), bookings });
      }
    }

    // In-memory fallback (offline / demo mode)
    const memUser = memoryStore.findUserById(session.userId);
    if (!memUser) return fail("User profile not found.", 404);

    return ok({
      user: toCustomerProfile(memUser),
      bookings: memoryStore.getUserBookings(memUser.id, memUser.email, memUser.phone),
    });
  } catch (err) {
    console.error("Customer profile error:", err);
    return fail(errorMessage(err, "Failed to fetch user data."), 500);
  }
}

/** PUT /api/auth/customer/me — update the signed-in customer's own profile. */
export async function PUT(req: Request) {
  try {
    const session = getCustomerSession(req);
    if (!session?.userId) return fail("Please sign in to update your profile.", 401);

    const { name, phone, email, address, profilePic } = await req.json();
    const db = await connectToDatabase();

    if (db) {
      const user = await UserModel.findById(session.userId).catch(() => null);
      if (user) {
        if (name) user.name = name.trim();
        if (phone) user.phone = phone.trim();
        if (email) user.email = email.trim().toLowerCase();
        if (address !== undefined) user.address = address.trim();
        if (profilePic !== undefined) {
          user.profilePic = profilePic;
          user.profilePhoto = profilePic;
        }
        await user.save();
        return ok({ message: "Profile updated successfully!", user: toCustomerProfile(user) });
      }
    }

    const memUser = memoryStore.updateUser(session.userId, {
      ...(name && { name: name.trim() }),
      ...(phone && { phone: phone.trim() }),
      ...(email && { email: email.trim().toLowerCase() }),
      ...(address !== undefined && { address: address.trim() }),
      ...(profilePic !== undefined && { profilePic, profilePhoto: profilePic }),
    });
    if (!memUser) return fail("User profile not found.", 404);

    return ok({ message: "Profile updated successfully!", user: toCustomerProfile(memUser) });
  } catch (err) {
    return fail(errorMessage(err, "Failed to update profile."), 500);
  }
}

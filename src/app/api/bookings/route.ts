import { connectToDatabase } from "@/lib/db";
import { BookingModel, UserModel } from "@/lib/models";
import { memoryStore } from "@/lib/memoryStore";
import { ok, fail, errorMessage, getCustomerSession, phoneTail } from "@/lib/api";

/** Fields a customer is allowed to set when creating a booking. Admin-only fields are excluded. */
const CUSTOMER_BOOKING_FIELDS = [
  "userId",
  "customerName",
  "phone",
  "email",
  "address",
  "tripType",
  "serviceType",
  "serviceCategory",
  "venueName",
  "cabCount",
  "companyName",
  "shiftRosterInfo",
  "packageHours",
  "otpVerified",
  "otpCode",
  "specialRequests",
  "pickupCity",
  "dropCity",
  "pickupDate",
  "pickupTime",
  "vehicleId",
  "vehicleName",
  "estimatedDistanceKm",
  "totalFare",
] as const;

function pickCustomerFields(body: Record<string, any>) {
  const data: Record<string, any> = {};
  for (const key of CUSTOMER_BOOKING_FIELDS) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  return data;
}

/** Booking references shown to customers are generated in the browser (e.g. AUR-123456, AUR-WED-12345). */
const BOOKING_ID_PATTERN = /^AUR-[A-Z0-9-]{4,20}$/;

function resolveBookingId(requested: unknown): string {
  if (typeof requested === "string" && BOOKING_ID_PATTERN.test(requested)) return requested;
  return `AUR-${Math.floor(100000 + Math.random() * 900000)}`;
}

/** POST /api/bookings — create a new cab booking (guest or signed-in customer). */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session = getCustomerSession(req);
    const data = pickCustomerFields(body);
    if (session?.userId) data.userId = session.userId;

    const bookingId = resolveBookingId(body.bookingId);
    const db = await connectToDatabase();

    if (db) {
      const booking = await BookingModel.create({ ...data, bookingId, status: "Pending" });
      return ok({ data: booking }, 201);
    }

    const booking = memoryStore.addBooking({
      bookingId,
      userId: data.userId || "",
      customerName: data.customerName || "Guest Rider",
      phone: data.phone || "",
      email: data.email || "",
      address: data.address || "",
      tripType: data.tripType || "one-way",
      pickupCity: data.pickupCity || "Chennai",
      dropCity: data.dropCity || "Madurai",
      pickupDate: data.pickupDate || "",
      pickupTime: data.pickupTime || "",
      vehicleId: data.vehicleId || "",
      vehicleName: data.vehicleName || "",
      estimatedDistanceKm: data.estimatedDistanceKm || 300,
      totalFare: data.totalFare || 0,
      status: "Pending",
      driverName: "",
      driverPhone: "",
      cabNumber: "",
      adminNotes: "",
    });
    return ok({ data: booking }, 201);
  } catch (err) {
    return fail(errorMessage(err), 500);
  }
}

/**
 * PUT /api/bookings — customer self-service cancellation.
 * Body: `{ bookingId, status: "Cancelled" }`. The booking must belong to the signed-in customer.
 */
export async function PUT(req: Request) {
  try {
    const session = getCustomerSession(req);
    if (!session?.userId) return fail("Please sign in to manage your bookings.", 401);

    const { bookingId, status } = await req.json();
    if (!bookingId) return fail("Missing booking ID.");
    if (status !== "Cancelled") return fail("Customers can only cancel bookings.", 403);

    const db = await connectToDatabase();

    if (db) {
      const booking = await BookingModel.findOne({ bookingId });
      if (!booking) return fail("Booking not found.", 404);

      const user = await UserModel.findById(session.userId).catch(() => null);
      const ownsBooking =
        booking.userId === session.userId ||
        (!!user?.email && booking.email?.toLowerCase() === user.email.toLowerCase()) ||
        (!!phoneTail(user?.phone) && phoneTail(booking.phone) === phoneTail(user?.phone));
      if (!ownsBooking) return fail("You can only cancel your own bookings.", 403);

      booking.status = "Cancelled";
      await booking.save();
      return ok({ data: booking });
    }

    const memUser = memoryStore.findUserById(session.userId);
    const owned = memUser ? memoryStore.getUserBookings(memUser.id, memUser.email, memUser.phone) : [];
    const booking = owned.find((b) => b.bookingId === bookingId);
    if (!booking) return fail("Booking not found.", 404);

    booking.status = "Cancelled";
    return ok({ data: booking });
  } catch (err) {
    return fail(errorMessage(err), 500);
  }
}

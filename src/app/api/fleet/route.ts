import { connectToDatabase } from "@/lib/db";
import { VehicleModel } from "@/lib/models";
import { FLEET } from "@/data/fleet";
import { ok } from "@/lib/api";

/** Always serve live data — content is edited from the admin console. */
export const dynamic = "force-dynamic";

/** GET /api/fleet — vehicles and per-km pricing. Seeds defaults on first run. */
export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db) return ok({ data: FLEET, fallback: true });

    let vehicles = await VehicleModel.find().lean();
    if (vehicles.length === 0) {
      await VehicleModel.insertMany(FLEET);
      vehicles = await VehicleModel.find().lean();
    }
    return ok({ data: vehicles });
  } catch {
    return ok({ data: FLEET, fallback: true });
  }
}

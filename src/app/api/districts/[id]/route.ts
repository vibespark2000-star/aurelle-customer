import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { DistrictModel } from "@/lib/models";
import { TN_DISTRICTS_DATA } from "@/data/districts";
import { normalizeDistrict } from "@/lib/districts";
import { ok, fail } from "@/lib/api";

/** Always serve live data — content is edited from the admin console. */
export const dynamic = "force-dynamic";

function findStatic(id: string) {
  return TN_DISTRICTS_DATA.find((d) => d.id.toLowerCase() === id || d.name.toLowerCase() === id);
}

/** GET /api/districts/:id — one district by slug, name or Mongo id. */
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = params.id.toLowerCase();

  try {
    const db = await connectToDatabase();
    if (db) {
      const filter = mongoose.Types.ObjectId.isValid(id) ? { $or: [{ id }, { _id: id }] } : { id };
      const district = await DistrictModel.findOne(filter).lean();
      if (district) return ok({ data: normalizeDistrict(district) });
    }
  } catch {
    // fall through to static data
  }

  const match = findStatic(id);
  return match ? ok({ data: normalizeDistrict(match) }) : fail("District not found", 404);
}

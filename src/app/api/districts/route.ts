import { connectToDatabase } from "@/lib/db";
import { DistrictModel } from "@/lib/models";
import { TN_DISTRICTS_DATA } from "@/data/districts";
import { normalizeDistrict } from "@/lib/districts";
import { ok } from "@/lib/api";

/** Always serve live data — content is edited from the admin console. */
export const dynamic = "force-dynamic";

const fallback = () => ok({ data: (TN_DISTRICTS_DATA as any[]).map(normalizeDistrict), fallback: true });

/** GET /api/districts — all Tamil Nadu districts. Seeds defaults on first run. */
export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db) return fallback();

    let districts = await DistrictModel.find().lean();
    if (districts.length === 0) {
      await DistrictModel.insertMany((TN_DISTRICTS_DATA as any[]).map(normalizeDistrict));
      districts = await DistrictModel.find().lean();
    }
    return ok({ data: districts.map(normalizeDistrict) });
  } catch {
    return fallback();
  }
}

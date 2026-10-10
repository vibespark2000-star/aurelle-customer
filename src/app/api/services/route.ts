import { connectToDatabase } from "@/lib/db";
import { ServicePackageModel } from "@/lib/models";
import { SAMPLE_SERVICES } from "@/data/services";
import { ok } from "@/lib/api";

/** Always serve live data — content is edited from the admin console. */
export const dynamic = "force-dynamic";

const fallback = () => ok({ count: SAMPLE_SERVICES.length, data: SAMPLE_SERVICES, fallback: true });

/** GET /api/services?category= — active service packages (wedding, corporate, hourly...). */
export async function GET(req: Request) {
  try {
    const db = await connectToDatabase();
    if (!db) return fallback();

    const category = new URL(req.url).searchParams.get("category");
    const filter: any = { isActive: true };
    if (category && category !== "All") filter.category = category;

    let services = await ServicePackageModel.find(filter).sort({ sortOrder: 1, createdAt: -1 });

    // Seed default packages the first time the collection is empty.
    if (services.length === 0 && (await ServicePackageModel.estimatedDocumentCount()) === 0) {
      await ServicePackageModel.insertMany(SAMPLE_SERVICES);
      services = await ServicePackageModel.find(filter).sort({ sortOrder: 1, createdAt: -1 });
    }

    return ok({ count: services.length, data: services });
  } catch (err) {
    console.error("GET /api/services error:", err);
    return fallback();
  }
}

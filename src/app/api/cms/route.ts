import { connectToDatabase } from "@/lib/db";
import { CmsContentModel } from "@/lib/models";
import { memoryStore } from "@/lib/memoryStore";
import { DEFAULT_CMS_CONTENT } from "@/data/cms";
import { ok } from "@/lib/api";

/** Always serve live data — content is edited from the admin console. */
export const dynamic = "force-dynamic";

/** GET /api/cms?type=faq|privacy_policy|terms_conditions — editable site content. */
export async function GET(req: Request) {
  const type = new URL(req.url).searchParams.get("type") || undefined;
  const fallback = () => ok({ data: memoryStore.getCmsItems(type), fallback: true });

  try {
    const db = await connectToDatabase();
    if (!db) return fallback();

    if ((await CmsContentModel.estimatedDocumentCount()) === 0) {
      await CmsContentModel.create(DEFAULT_CMS_CONTENT);
    }

    const items = await CmsContentModel.find(type ? { type } : {}).sort({ sortOrder: 1, createdAt: 1 });
    return ok({ data: items });
  } catch {
    return fallback();
  }
}

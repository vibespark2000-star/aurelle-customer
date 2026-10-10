import { connectToDatabase } from "@/lib/db";
import { BlogPostModel } from "@/lib/models";
import { SAMPLE_BLOGS } from "@/data/blogs";
import { ok } from "@/lib/api";

/** Always serve live data — content is edited from the admin console. */
export const dynamic = "force-dynamic";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** GET /api/blogs?category=&search= — published blog posts, newest first. */
export async function GET(req: Request) {
  try {
    const db = await connectToDatabase();
    if (!db) return ok({ data: SAMPLE_BLOGS, fallback: true });

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const query: any = { isPublished: true };
    if (category && category !== "All") query.category = category;
    if (search) {
      const pattern = new RegExp(escapeRegex(search), "i");
      query.$or = [{ title: pattern }, { excerpt: pattern }, { tags: { $in: [pattern] } }];
    }

    let blogs = await BlogPostModel.find(query).sort({ createdAt: -1 }).lean();

    // Seed sample posts the first time the collection is empty.
    if (blogs.length === 0 && !category && !search && (await BlogPostModel.estimatedDocumentCount()) === 0) {
      await BlogPostModel.insertMany(SAMPLE_BLOGS);
      blogs = await BlogPostModel.find(query).sort({ createdAt: -1 }).lean();
    }

    return ok({ data: blogs });
  } catch (err) {
    console.error("Fetch blogs error:", err);
    return ok({ data: SAMPLE_BLOGS, fallback: true });
  }
}

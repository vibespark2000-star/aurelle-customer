import { connectToDatabase } from "@/lib/db";
import { BlogPostModel } from "@/lib/models";
import { SAMPLE_BLOGS } from "@/data/blogs";
import { ok, fail } from "@/lib/api";

/** Always serve live data — content is edited from the admin console. */
export const dynamic = "force-dynamic";

/** GET /api/blogs/:slug — one post by slug or id; increments its view counter. */
export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    const db = await connectToDatabase();
    if (db) {
      const blog = await BlogPostModel.findOneAndUpdate(
        { $or: [{ slug }, { id: slug }] },
        { $inc: { views: 1 } },
        { new: true }
      ).lean();
      if (blog) return ok({ data: blog });
    }
  } catch {
    // fall through to sample content
  }

  const sample = SAMPLE_BLOGS.find((b) => b.slug === slug || b.id === slug);
  return sample ? ok({ data: sample, fallback: true }) : fail("Blog post not found", 404);
}

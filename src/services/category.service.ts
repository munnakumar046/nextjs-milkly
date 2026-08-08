import "server-only";

import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import type { CategoryOption } from "@/types/category";

/**
 * Lists active categories for use in pickers (e.g. the product form).
 * Full category CRUD (create/update/delete) is a separate, later phase.
 */
export async function getCategoryOptions(): Promise<CategoryOption[]> {
  await connectDB();

  const categories = await Category.find({ isActive: true })
    .select("_id name slug")
    .sort({ name: 1 })
    .lean();

  return categories.map((category) => ({
    id: category._id.toString(),
    name: category.name,
    slug: category.slug,
  }));
}

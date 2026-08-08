"use server";

import { getCategoryOptions } from "@/services/category.service";
import type { CategoryOption } from "@/types/category";

export async function getCategories(): Promise<CategoryOption[]> {
  return getCategoryOptions();
}

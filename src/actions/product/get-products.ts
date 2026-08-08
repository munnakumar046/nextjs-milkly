"use server";

import { getProducts as getProductsFromDB } from "@/services/product.service";
import type { ProductListResult, ProductQuery } from "@/types/product";

/**
 * Public read - used by the (future) storefront listing/search pages.
 * Always customer-scoped (available products only), regardless of what's
 * passed in - admin views use the service layer directly, not this action.
 */
export async function getProducts(
  query: Omit<ProductQuery, "includeUnavailable"> = {},
): Promise<ProductListResult> {
  return getProductsFromDB({ ...query, includeUnavailable: false });
}

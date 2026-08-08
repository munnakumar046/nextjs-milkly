"use server";

import { getProductBySlug } from "@/services/product.service";
import type { ProductDTO } from "@/types/product";

/**
 * Public read - used by the (future) storefront product detail page.
 * Only ever returns available products; unavailable products are treated
 * as not found so they aren't discoverable by customers via a direct link.
 */
export async function getProduct(slug: string): Promise<ProductDTO | null> {
  const product = await getProductBySlug(slug);

  if (!product || !product.isAvailable) {
    return null;
  }

  return product;
}

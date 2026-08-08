"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin, authErrorMessage } from "@/lib/auth";
import {
  deleteProduct as deleteProductInDB,
  ProductServiceError,
} from "@/services/product.service";
import type { ProductActionResult } from "@/types/product";

export async function deleteProduct(id: string): Promise<ProductActionResult> {
  try {
    await requireAdmin();
  } catch (error) {
    const message = authErrorMessage(error);
    if (message) return { success: false, message };
    throw error;
  }

  try {
    await deleteProductInDB(id);

    revalidatePath("/admin/products");

    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof ProductServiceError) {
      return { success: false, message: error.message };
    }

    console.error("deleteProduct: unexpected error", error);

    return {
      success: false,
      message: "Failed to delete product. Please try again.",
    };
  }
}

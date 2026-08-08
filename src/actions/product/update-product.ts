"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin, authErrorMessage } from "@/lib/auth";
import {
  updateProduct as updateProductInDB,
  ProductServiceError,
} from "@/services/product.service";
import { UpdateProductSchema } from "@/validations/product";
import type { ProductActionResult, ProductDTO } from "@/types/product";

export async function updateProduct(
  id: string,
  input: unknown,
): Promise<ProductActionResult<ProductDTO>> {
  try {
    await requireAdmin();
  } catch (error) {
    const message = authErrorMessage(error);
    if (message) return { success: false, message };
    throw error;
  }

  const validated = UpdateProductSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      message: validated.error.issues[0].message,
    };
  }

  try {
    const product = await updateProductInDB(id, validated.data);

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}/edit`);

    return { success: true, data: product };
  } catch (error) {
    if (error instanceof ProductServiceError) {
      return { success: false, message: error.message };
    }

    console.error("updateProduct: unexpected error", error);

    return {
      success: false,
      message: "Failed to update product. Please try again.",
    };
  }
}

"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin, authErrorMessage } from "@/lib/auth";
import {
  createProduct as createProductInDB,
  ProductServiceError,
} from "@/services/product.service";
import { CreateProductSchema } from "@/validations/product";
import type { ProductActionResult, ProductDTO } from "@/types/product";

export async function createProduct(
  input: unknown,
): Promise<ProductActionResult<ProductDTO>> {
  try {
    await requireAdmin();
  } catch (error) {
    const message = authErrorMessage(error);
    if (message) return { success: false, message };
    throw error;
  }

  const validated = CreateProductSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      message: validated.error.issues[0].message,
    };
  }

  try {
    const product = await createProductInDB(validated.data);

    revalidatePath("/admin/products");

    return { success: true, data: product };
  } catch (error) {
    if (error instanceof ProductServiceError) {
      return { success: false, message: error.message };
    }

    console.error("createProduct: unexpected error", error);

    return {
      success: false,
      message: "Failed to create product. Please try again.",
    };
  }
}

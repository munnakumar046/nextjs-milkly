import type {
  CreateProductInput,
  UpdateProductInput,
} from "@/validations/product";
import type { ProductUnit } from "@/constants/product";

export type { CreateProductInput, UpdateProductInput };

export type ProductNutritionDTO = {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};

export type ProductDTO = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  images: string[];
  brand: string;
  unit: ProductUnit;
  quantity: number;
  price: number;
  comparePrice: number;
  stock: number;
  isFeatured: boolean;
  isAvailable: boolean;
  nutrition: ProductNutritionDTO;
  createdAt: string;
  updatedAt: string;
};

export type ProductQuery = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isFeatured?: boolean;
  /** Admin-only: include products with isAvailable: false. */
  includeUnavailable?: boolean;
};

export type ProductListResult = {
  items: ProductDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/**
 * Result shape for product server actions. Distinct from the auth
 * `ActionResult` (types/auth.ts) because these carry a data payload.
 */
export type ProductActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; message: string };

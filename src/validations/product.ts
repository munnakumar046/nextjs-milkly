import { z } from "zod";

import { PRODUCT_UNITS } from "@/constants/product";

// This schema is imported by the client-side product form (for
// zodResolver), so it must never import mongoose or any server-only
// module - a plain regex check keeps this file bundle-safe.
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id.");

const nutritionSchema = z.object({
  calories: z.coerce.number().min(0).default(0),
  protein: z.coerce.number().min(0).default(0),
  fat: z.coerce.number().min(0).default(0),
  carbs: z.coerce.number().min(0).default(0),
});

// Slug is intentionally excluded: it's derived server-side from `name` and
// must never be trusted from client input.
export const ProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(120, "Name must be under 120 characters."),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters."),

  shortDescription: z
    .string()
    .trim()
    .max(200, "Short description must be under 200 characters.")
    .default(""),

  category: objectIdSchema,

  images: z
    .array(z.string().trim().url("Each image must be a valid URL."))
    .default([]),

  brand: z.string().trim().min(1, "Brand is required.").default("B2 MILK"),

  unit: z.enum(PRODUCT_UNITS, {
    message: "Select a valid unit.",
  }),

  quantity: z.coerce.number().positive("Quantity must be greater than 0."),

  price: z.coerce.number().min(0, "Price cannot be negative."),

  comparePrice: z.coerce
    .number()
    .min(0, "Compare price cannot be negative.")
    .default(0),

  stock: z.coerce.number().int().min(0, "Stock cannot be negative.").default(0),

  isFeatured: z.boolean().default(false),

  isAvailable: z.boolean().default(true),

  nutrition: nutritionSchema.default({
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  }),
});

export const CreateProductSchema = ProductSchema;
export const UpdateProductSchema = ProductSchema.partial();

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;

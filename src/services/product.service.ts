import "server-only";

import slugify from "slugify";
import { Types } from "mongoose";

import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import type {
  CreateProductInput,
  UpdateProductInput,
  ProductDTO,
  ProductQuery,
  ProductListResult,
} from "@/types/product";

/**
 * Known, user-facing failure (bad category id, not found, etc), as opposed
 * to an unexpected DB/infra error. Actions use this distinction to decide
 * whether it's safe to show `error.message` to the caller.
 */
export class ProductServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductServiceError";
  }
}

type PopulatedCategory = {
  _id: Types.ObjectId;
  name: string;
  slug: string;
};

type ProductLean = {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: PopulatedCategory | Types.ObjectId | null;
  images: string[];
  brand: string;
  unit: ProductDTO["unit"];
  quantity: number;
  price: number;
  comparePrice: number;
  stock: number;
  isFeatured: boolean;
  isAvailable: boolean;
  nutrition: ProductDTO["nutrition"];
  createdAt: Date;
  updatedAt: Date;
};

function isPopulatedCategory(
  category: ProductLean["category"],
): category is PopulatedCategory {
  return !!category && "name" in category;
}

function toProductDTO(doc: ProductLean): ProductDTO {
  return {
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    description: doc.description,
    shortDescription: doc.shortDescription,
    category: isPopulatedCategory(doc.category)
      ? {
          id: doc.category._id.toString(),
          name: doc.category.name,
          slug: doc.category.slug,
        }
      : null,
    images: doc.images,
    brand: doc.brand,
    unit: doc.unit,
    quantity: doc.quantity,
    price: doc.price,
    comparePrice: doc.comparePrice,
    stock: doc.stock,
    isFeatured: doc.isFeatured,
    isAvailable: doc.isAvailable,
    nutrition: doc.nutrition,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

async function generateUniqueSlug(
  name: string,
  excludeId?: string,
): Promise<string> {
  const base = slugify(name, { lower: true, strict: true });
  let slug = base || "product";
  let suffix = 1;

  // Small, bounded collision loop - product name collisions are rare and
  // this runs against an indexed field.
  while (
    await Product.exists({
      slug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    })
  ) {
    suffix += 1;
    slug = `${base}-${suffix}`;
  }

  return slug;
}

const CATEGORY_POPULATE_FIELDS = "name slug";

export async function createProduct(
  input: CreateProductInput,
): Promise<ProductDTO> {
  await connectDB();

  const categoryExists = await Category.exists({ _id: input.category });

  if (!categoryExists) {
    throw new ProductServiceError("Selected category does not exist.");
  }

  const slug = await generateUniqueSlug(input.name);

  const created = await Product.create({ ...input, slug });

  const populated = await Product.findById(created._id)
    .populate<{
      category: PopulatedCategory;
    }>("category", CATEGORY_POPULATE_FIELDS)
    .lean();

  if (!populated) {
    throw new ProductServiceError(
      "Product was created but could not be loaded.",
    );
  }

  return toProductDTO(populated as ProductLean);
}

export async function updateProduct(
  id: string,
  input: UpdateProductInput,
): Promise<ProductDTO> {
  await connectDB();

  if (!Types.ObjectId.isValid(id)) {
    throw new ProductServiceError("Invalid product id.");
  }

  const existing = await Product.findById(id);

  if (!existing) {
    throw new ProductServiceError("Product not found.");
  }

  if (input.category) {
    const categoryExists = await Category.exists({ _id: input.category });

    if (!categoryExists) {
      throw new ProductServiceError("Selected category does not exist.");
    }
  }

  if (input.name && input.name !== existing.name) {
    existing.slug = await generateUniqueSlug(input.name, id);
  }

  Object.assign(existing, input);
  await existing.save();

  const populated = await Product.findById(id)
    .populate<{
      category: PopulatedCategory;
    }>("category", CATEGORY_POPULATE_FIELDS)
    .lean();

  if (!populated) {
    throw new ProductServiceError("Product not found.");
  }

  return toProductDTO(populated as ProductLean);
}

export async function deleteProduct(id: string): Promise<void> {
  await connectDB();

  if (!Types.ObjectId.isValid(id)) {
    throw new ProductServiceError("Invalid product id.");
  }

  const deleted = await Product.findByIdAndDelete(id);

  if (!deleted) {
    throw new ProductServiceError("Product not found.");
  }
}

export async function getProductById(id: string): Promise<ProductDTO | null> {
  await connectDB();

  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  const product = await Product.findById(id)
    .populate<{
      category: PopulatedCategory;
    }>("category", CATEGORY_POPULATE_FIELDS)
    .lean();

  return product ? toProductDTO(product as ProductLean) : null;
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductDTO | null> {
  await connectDB();

  const product = await Product.findOne({ slug })
    .populate<{
      category: PopulatedCategory;
    }>("category", CATEGORY_POPULATE_FIELDS)
    .lean();

  return product ? toProductDTO(product as ProductLean) : null;
}

export async function getProducts(
  query: ProductQuery = {},
): Promise<ProductListResult> {
  await connectDB();

  const page = Math.max(1, query.page ?? 1);
  const limit = Math.min(100, Math.max(1, query.limit ?? 20));

  const filter: Record<string, unknown> = {};

  if (!query.includeUnavailable) {
    filter.isAvailable = true;
  }

  if (query.category && Types.ObjectId.isValid(query.category)) {
    filter.category = query.category;
  }

  if (typeof query.isFeatured === "boolean") {
    filter.isFeatured = query.isFeatured;
  }

  if (query.search?.trim()) {
    filter.$text = { $search: query.search.trim() };
  }

  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate<{ category: PopulatedCategory }>(
        "category",
        CATEGORY_POPULATE_FIELDS,
      )
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return {
    items: (items as ProductLean[]).map(toProductDTO),
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

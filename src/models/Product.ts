import { Schema, model, models, Types, type Model } from "mongoose";

import { PRODUCT_UNITS, type ProductUnit } from "@/constants/product";

export { PRODUCT_UNITS };
export type { ProductUnit };

export interface IProductNutrition {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface IProduct {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: Types.ObjectId;
  images: string[];
  brand: string;
  unit: ProductUnit;
  quantity: number;
  price: number;
  comparePrice: number;
  stock: number;
  isFeatured: boolean;
  isAvailable: boolean;
  nutrition: IProductNutrition;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    shortDescription: {
      type: String,
      default: "",
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    images: [
      {
        type: String,
      },
    ],

    brand: {
      type: String,
      default: "B2 MILK",
    },

    unit: {
      type: String,
      enum: PRODUCT_UNITS,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    comparePrice: {
      type: Number,
      default: 0,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    nutrition: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  },
);

productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1 });
productSchema.index({ slug: 1 });

export const Product: Model<IProduct> =
  (models.Product as Model<IProduct>) ||
  model<IProduct>("Product", productSchema);

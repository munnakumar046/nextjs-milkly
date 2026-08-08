"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";

import { createProduct } from "@/actions/product/create-product";
import { updateProduct } from "@/actions/product/update-product";
import {
  CreateProductSchema,
  type CreateProductInput,
} from "@/validations/product";

// Because the schema uses z.coerce/.default(), the *pre-validation* form
// shape (what react-hook-form manages field-by-field) differs from the
// *post-validation* shape (what gets submitted). react-hook-form's 3-generic
// useForm<Input, Context, Output> lets both be represented accurately.
type ProductFormValues = z.input<typeof CreateProductSchema>;
import { PRODUCT_UNITS } from "@/constants/product";
import type { CategoryOption } from "@/types/category";
import type { ProductDTO } from "@/types/product";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type ProductFormProps = {
  categories: CategoryOption[];
  /** When provided, the form edits this product instead of creating one. */
  product?: ProductDTO;
};

function toDefaultValues(product?: ProductDTO): ProductFormValues {
  return {
    name: product?.name ?? "",
    description: product?.description ?? "",
    shortDescription: product?.shortDescription ?? "",
    category: product?.category?.id ?? "",
    images: product?.images ?? [],
    brand: product?.brand ?? "B2 MILK",
    unit: product?.unit ?? "L",
    quantity: product?.quantity ?? 1,
    price: product?.price ?? 0,
    comparePrice: product?.comparePrice ?? 0,
    stock: product?.stock ?? 0,
    isFeatured: product?.isFeatured ?? false,
    isAvailable: product?.isAvailable ?? true,
    nutrition: {
      calories: product?.nutrition.calories ?? 0,
      protein: product?.nutrition.protein ?? 0,
      fat: product?.nutrition.fat ?? 0,
      carbs: product?.nutrition.carbs ?? 0,
    },
  };
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditMode = !!product;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues, unknown, CreateProductInput>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: toDefaultValues(product),
  });

  const images = watch("images") ?? [];

  const onSubmit = (values: CreateProductInput) => {
    startTransition(async () => {
      const result = isEditMode
        ? await updateProduct(product.id, values)
        : await createProduct(values);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(isEditMode ? "Product updated." : "Product created.");
      router.push("/admin/products");
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardContent className="space-y-5 pt-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                placeholder="Full Cream Milk"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Describe the product..."
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Input
                id="shortDescription"
                placeholder="One-line summary for listing cards"
                {...register("shortDescription")}
              />
              {errors.shortDescription && (
                <p className="text-sm text-destructive">
                  {errors.shortDescription.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select id="category" {...register("category")}>
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">
                  {errors.category.message}
                </p>
              )}
              {categories.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No categories exist yet. Category management is coming in a
                  later phase.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" {...register("brand")} />
              {errors.brand && (
                <p className="text-sm text-destructive">
                  {errors.brand.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select id="unit" {...register("unit")}>
                {PRODUCT_UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </Select>
              {errors.unit && (
                <p className="text-sm text-destructive">
                  {errors.unit.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (per unit)</Label>
              <Input
                id="quantity"
                type="number"
                step="any"
                {...register("quantity")}
              />
              {errors.quantity && (
                <p className="text-sm text-destructive">
                  {errors.quantity.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price")}
              />
              {errors.price && (
                <p className="text-sm text-destructive">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="comparePrice">Compare-at Price (₹)</Label>
              <Input
                id="comparePrice"
                type="number"
                step="0.01"
                {...register("comparePrice")}
              />
              {errors.comparePrice && (
                <p className="text-sm text-destructive">
                  {errors.comparePrice.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" step="1" {...register("stock")} />
              {errors.stock && (
                <p className="text-sm text-destructive">
                  {errors.stock.message}
                </p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="images">Image URLs (one per line)</Label>
              <Textarea
                id="images"
                rows={3}
                placeholder="https://example.com/milk-1.jpg"
                defaultValue={images.join("\n")}
                onChange={(event) =>
                  setValue(
                    "images",
                    event.target.value
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean),
                    { shouldValidate: true },
                  )
                }
              />
              <p className="text-xs text-muted-foreground">
                Direct image upload will be added with Cloudinary integration in
                a later phase - paste hosted URLs for now.
              </p>
              {errors.images && (
                <p className="text-sm text-destructive">
                  {errors.images.message ??
                    "One or more image URLs are invalid."}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 border-t pt-5">
            <div className="flex items-center gap-2">
              <Checkbox id="isFeatured" {...register("isFeatured")} />
              <Label
                htmlFor="isFeatured"
                className="cursor-pointer font-normal"
              >
                Featured product
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="isAvailable" {...register("isAvailable")} />
              <Label
                htmlFor="isAvailable"
                className="cursor-pointer font-normal"
              >
                Available to customers
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <p className="text-sm font-medium">Nutrition (optional, per unit)</p>

          <div className="grid gap-4 sm:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                step="any"
                {...register("nutrition.calories")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                step="any"
                {...register("nutrition.protein")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                type="number"
                step="any"
                {...register("nutrition.fat")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                step="any"
                {...register("nutrition.carbs")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
          disabled={isPending}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : isEditMode ? (
            "Save Changes"
          ) : (
            "Create Product"
          )}
        </Button>
      </div>
    </form>
  );
}

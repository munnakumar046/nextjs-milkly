import { notFound } from "next/navigation";

import { PageHeader } from "@/components/common/page-header";
import { ProductForm } from "@/components/admin/product-form";
import { getProductById } from "@/services/product.service";
import { getCategoryOptions } from "@/services/category.service";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategoryOptions(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Product" description={product.name} />

      <ProductForm categories={categories} product={product} />
    </div>
  );
}

import { PageHeader } from "@/components/common/page-header";
import { ProductForm } from "@/components/admin/product-form";
import { getCategoryOptions } from "@/services/category.service";

export default async function NewProductPage() {
  const categories = await getCategoryOptions();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Product"
        description="Create a new product in your catalog."
      />

      <ProductForm categories={categories} />
    </div>
  );
}

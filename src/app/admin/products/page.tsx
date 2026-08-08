import Link from "next/link";
import { Plus } from "lucide-react";

import { getProducts } from "@/services/product.service";

import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { ProductTable } from "@/components/admin/product-table";
import { Button } from "@/components/ui/button";

export default async function AdminProductsPage() {
  const { items: products } = await getProducts({
    includeUnavailable: true,
    limit: 100,
  });

  const addProductButton = (
    <Button render={<Link href="/admin/products/new" />}>
      <Plus className="h-4 w-4" />
      Add Product
    </Button>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your product catalog."
        action={addProductButton}
      />

      {products.length === 0 ? (
        <EmptyState
          title="No products yet"
          description="Create your first product to start building your catalog."
          action={addProductButton}
        />
      ) : (
        <ProductTable products={products} />
      )}
    </div>
  );
}

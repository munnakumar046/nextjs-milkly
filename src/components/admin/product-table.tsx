"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteProduct } from "@/actions/product/delete-product";
import type { ProductDTO } from "@/types/product";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ProductTableProps = {
  products: ProductDTO[];
};

export function ProductTable({ products }: ProductTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleDelete = (product: ProductDTO) => {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    setPendingId(product.id);

    startTransition(async () => {
      const result = await deleteProduct(product.id);

      if (!result.success) {
        toast.error(result.message);
        setPendingId(null);
        return;
      }

      toast.success("Product deleted.");
      setPendingId(null);
      router.refresh();
    });
  };

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span>{product.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {product.quantity} {product.unit}
                  </span>
                </div>
              </TableCell>

              <TableCell>{product.category?.name ?? "—"}</TableCell>

              <TableCell>₹{product.price.toFixed(2)}</TableCell>

              <TableCell>
                {product.stock > 0 ? (
                  product.stock
                ) : (
                  <span className="text-destructive">Out of stock</span>
                )}
              </TableCell>

              <TableCell>
                <div className="flex flex-wrap gap-1">
                  <Badge
                    variant={product.isAvailable ? "default" : "secondary"}
                  >
                    {product.isAvailable ? "Available" : "Hidden"}
                  </Badge>

                  {product.isFeatured && (
                    <Badge variant="outline">Featured</Badge>
                  )}
                </div>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    render={
                      <Link href={`/admin/products/${product.id}/edit`} />
                    }
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isPending && pendingId === product.id}
                    onClick={() => handleDelete(product)}
                  >
                    {isPending && pendingId === product.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-destructive" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

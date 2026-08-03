import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CartButton() {
  // Later this will come from Zustand
  const cartCount = 0;

  return (
    <Button variant="ghost" size="icon" className="relative">
      <Link href="/cart">
        <ShoppingCart className="h-5 w-5" />

        {cartCount > 0 && (
          <Badge className="absolute -right-2 -top-2 h-5 min-w-5 rounded-full px-1 flex items-center justify-center">
            {cartCount}
          </Badge>
        )}
      </Link>
    </Button>
  );
}

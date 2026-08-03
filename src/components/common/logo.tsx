import Link from "next/link";
import { Milk } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="rounded-full bg-emerald-600 p-2 text-white">
        <Milk className="h-5 w-5" />
      </div>

      <div className="flex flex-col leading-none">
        <span className="text-lg font-bold">MILKY</span>
        <span className="text-xs text-muted-foreground">
          Fresh Milk Delivery
        </span>
      </div>
    </Link>
  );
}

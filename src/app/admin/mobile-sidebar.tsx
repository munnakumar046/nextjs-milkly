"use client";

import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Sidebar } from "./sidebar";

export function MobileSidebar() {
  return (
    <div className="border-b p-4 lg:hidden">
      <Sheet>
        <SheetTrigger>
          <Button size="icon" variant="outline">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-64 p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>
    </div>
  );
}

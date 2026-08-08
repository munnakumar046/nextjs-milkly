"use client";

import { ThemeToggle } from "@/components/common/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-6">
      <h1 className="text-xl font-semibold">Admin Panel</h1>

      <ThemeToggle />
    </header>
  );
}

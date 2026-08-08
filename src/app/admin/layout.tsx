import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { USER_ROLE } from "@/constants/roles";

import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { MobileSidebar } from "./mobile-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  // Defense in depth: proxy.ts already redirects unauthenticated/non-admin
  // users before this ever renders, but the layout re-checks server-side so
  // this route tree is never reachable purely by skipping the proxy layer.
  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  if (session.user.role !== USER_ROLE.ADMIN) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-background lg:block">
        <Sidebar />
      </aside>

      <div className="lg:pl-64">
        {/* Header */}
        <Header />

        {/* Mobile Sidebar */}
        <MobileSidebar />

        {/* Main Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

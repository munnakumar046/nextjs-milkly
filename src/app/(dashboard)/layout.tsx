import type { ReactNode } from "react";
import { Sidebar } from "../admin/sidebar";
import { Header } from "../admin/header";
import { MobileSidebar } from "../admin/mobile-sidebar";



export default function AdminLayout({ children }: { children: ReactNode }) {
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

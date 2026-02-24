"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  Inbox,
  FileText,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen },
  { href: "/admin/submissions", label: "Submissions", icon: Inbox },
  { href: "/admin/articles", label: "Articles", icon: FileText },
];

export function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    document.cookie =
      "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
    router.push("/admin/login");
  }

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-lg font-bold tracking-tight">OSIS AP Admin</h1>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition",
              isActive(item.href) && "bg-gray-800 text-white"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col bg-gray-950 text-white">
        {sidebar}
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-gray-950 text-white transform transition-transform md:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebar}
      </aside>

      {/* Main content */}
      <div className="md:pl-64">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center h-14 bg-white border-b border-gray-200 px-4 md:hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
          <span className="ml-3 font-semibold text-sm">OSIS AP Admin</span>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

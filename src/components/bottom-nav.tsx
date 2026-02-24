"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FolderOpen, Search, Trophy, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/projects", label: "Projects", icon: FolderOpen },
  { href: "/check-status", label: "Status", icon: Search },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "#", label: "Menu", icon: Menu },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg z-50">
      <ul className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href) && item.href !== "#";

          return (
            <li key={item.label}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-gray-400",
                  isActive && "text-black"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

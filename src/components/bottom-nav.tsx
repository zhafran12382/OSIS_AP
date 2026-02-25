"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FolderOpen, Search, Trophy, Menu, X, ShieldCheck, Info, LogIn, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStudentAuth } from "@/lib/student-auth";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/projects", label: "Projects", icon: FolderOpen },
  { href: "/check-status", label: "Status", icon: Search },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

const menuItems = [
  { href: "/admin/login", label: "Admin Login", icon: ShieldCheck },
  { href: "/leaderboard", label: "Hall of Fame", icon: Trophy },
  { href: "/projects", label: "Semua Proyek", icon: FolderOpen },
  { href: "/check-status", label: "Cek Status", icon: Info },
];

export function BottomNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { student, logout, setShowLoginModal } = useStudentAuth();

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Hide on admin routes
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      {/* Menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setMenuOpen(false)} />
      )}

      {/* Menu popup */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="fixed bottom-20 right-4 z-50 bg-white rounded-xl shadow-xl border border-gray-200 py-2 min-w-[200px]"
        >
          {/* Student login/status section */}
          {student ? (
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-semibold text-gray-800">{student.name}</span>
              </div>
              <span className="text-xs text-gray-500">Kelas {student.studentClass}</span>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 mt-2 text-xs text-gray-500 hover:text-gray-800 transition"
              >
                <LogOut className="h-3 w-3" /> Keluar
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setShowLoginModal(true);
                setMenuOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition w-full border-b border-gray-100"
            >
              <LogIn className="h-4 w-4 text-gray-500" />
              Login Siswa
            </button>
          )}

          {menuItems.map((item) => (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              <item.icon className="h-4 w-4 text-gray-500" />
              {item.label}
            </Link>
          ))}
        </div>
      )}

      <nav className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-lg border-t border-gray-200 shadow-lg z-50">
        <ul className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-gray-400 transition-all duration-200",
                    isActive && "text-black scale-110"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs mt-1">{item.label}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={cn(
                "flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-gray-400",
                menuOpen && "text-black"
              )}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="text-xs mt-1">Menu</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}

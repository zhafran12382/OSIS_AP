"use client";

import { useState, useEffect } from "react";
import { LogIn, X } from "lucide-react";
import { useStudentAuth } from "@/lib/student-auth";

export function LoginNotification() {
  const { student, setShowLoginModal } = useStudentAuth();
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || student || dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-30 bg-gray-900 text-white px-4 py-3 flex items-center justify-between gap-3 animate-slide-down">
      <p className="text-sm flex-1">
        👋 Masuk untuk mengumpulkan tugas dan mengikuti kegiatan!
      </p>
      <button
        onClick={() => setShowLoginModal(true)}
        className="shrink-0 inline-flex items-center gap-1 bg-white text-gray-900 text-xs font-semibold rounded-full px-3 py-1.5 hover:bg-gray-100 transition"
      >
        <LogIn className="w-3 h-3" /> Login
      </button>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 text-gray-400 hover:text-white transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

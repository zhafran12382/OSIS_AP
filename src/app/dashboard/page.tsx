"use client";

import { useEffect, useState } from "react";
import { useStudentAuth } from "@/lib/student-auth";
import { supabase } from "@/lib/supabase";
import type { Submission } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";
import { User, BookOpen, LogIn } from "lucide-react";

export default function DashboardPage() {
  const { student, setShowLoginModal } = useStudentAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!student) return;
    setLoading(true);
    supabase
      .from("submissions")
      .select("*, projects(title)")
      .eq("student_name", student.name)
      .eq("student_class", student.studentClass)
      .order("submitted_at", { ascending: false })
      .then(({ data }) => {
        setSubmissions((data as Submission[]) ?? []);
        setLoading(false);
      });
  }, [student]);

  if (!mounted) return null;

  if (!student) {
    return (
      <main className="min-h-screen bg-gray-50 pb-24 flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-xl font-bold mb-2">Dashboard Akun</h1>
          <p className="text-sm text-gray-500 mb-6">
            Masuk untuk melihat informasi akun dan riwayat pengumpulan tugas kamu.
          </p>
          <button
            onClick={() => setShowLoginModal(true)}
            className="inline-flex items-center gap-2 bg-gray-900 text-white rounded-full px-6 py-3 text-sm font-semibold hover:bg-gray-800 transition"
          >
            <LogIn className="w-4 h-4" /> Login Sekarang
          </button>
        </div>
      </main>
    );
  }

  const approved = submissions.filter((s) => s.status === "approved").length;
  const pending = submissions.filter((s) => s.status === "pending").length;
  const rejected = submissions.filter((s) => s.status === "rejected").length;

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-6 pt-8 pb-10 border-b border-gray-100">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-6 animate-fade-in">
            <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center shrink-0">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{student.name}</h1>
              <p className="text-sm text-gray-500">Kelas {student.studentClass}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 animate-slide-up">
            {[
              { label: "Diterima", value: approved, color: "text-green-600" },
              { label: "Menunggu", value: pending, color: "text-yellow-600" },
              { label: "Ditolak", value: rejected, color: "text-red-500" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100"
              >
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 mt-8">
        <div className="flex items-center gap-2 mb-4 animate-fade-in">
          <BookOpen className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-bold">Riwayat Pengumpulan</h2>
        </div>

        {loading && (
          <div className="text-center py-8 text-gray-400">Memuat...</div>
        )}

        {!loading && submissions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 font-medium">Belum ada pengumpulan tugas.</p>
            <p className="text-sm text-gray-400 mt-1">
              Kumpulkan tugas pertamamu sekarang!
            </p>
          </div>
        )}

        {!loading && submissions.length > 0 && (
          <div className="space-y-4 animate-slide-up">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm truncate">
                      {(sub.projects as unknown as { title: string })?.title ?? "—"}
                    </p>
                    <p className="font-mono text-xs text-gray-400 mt-0.5">{sub.id}</p>
                  </div>
                  <StatusBadge status={sub.status} />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {new Date(sub.submitted_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  {sub.status === "approved" && sub.points_awarded > 0 && (
                    <span className="font-semibold text-green-600">
                      +{sub.points_awarded} poin
                    </span>
                  )}
                </div>
                {sub.notes && (
                  <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
                    {sub.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

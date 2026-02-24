"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Submission } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";
import { Check, X, Download, ExternalLink } from "lucide-react";

const POINTS_PER_APPROVAL = 10;

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  async function fetchSubmissions() {
    setLoading(true);
    let query = supabase
      .from("submissions")
      .select("*, projects(title)")
      .order("submitted_at", { ascending: false });

    if (filter !== "all") {
      query = query.eq("status", filter);
    }

    const { data } = await query;
    setSubmissions((data as Submission[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchSubmissions();
  }, [filter]);

  async function handleApprove(sub: Submission) {
    // Update submission status
    await supabase
      .from("submissions")
      .update({ status: "approved", points_awarded: POINTS_PER_APPROVAL })
      .eq("id", sub.id);

    // Update or insert leaderboard entry
    const { data: existing } = await supabase
      .from("leaderboard")
      .select("*")
      .eq("student_name", sub.student_name)
      .eq("student_class", sub.student_class)
      .single();

    if (existing) {
      await supabase
        .from("leaderboard")
        .update({
          total_score: existing.total_score + POINTS_PER_APPROVAL,
          approved_projects_count: existing.approved_projects_count + 1,
        })
        .eq("id", existing.id);
    } else {
      await supabase.from("leaderboard").insert({
        student_name: sub.student_name,
        student_class: sub.student_class,
        total_score: POINTS_PER_APPROVAL,
        approved_projects_count: 1,
      });
    }

    fetchSubmissions();
  }

  async function handleReject(id: string) {
    await supabase
      .from("submissions")
      .update({ status: "rejected" })
      .eq("id", id);
    fetchSubmissions();
  }

  async function handleExport() {
    const { data } = await supabase
      .from("submissions")
      .select("id, student_name, student_class, status, notes, file_url, submitted_at, projects(title)")
      .order("submitted_at", { ascending: false });

    if (!data || data.length === 0) return;

    const headers = [
      "ID",
      "Nama",
      "Kelas",
      "Proyek",
      "Status",
      "Catatan",
      "File URL",
      "Tanggal",
    ];
    const rows = data.map((s: Record<string, unknown>) => [
      s.id,
      s.student_name,
      s.student_class,
      (s.projects as { title: string } | null)?.title ?? "",
      s.status,
      s.notes ?? "",
      s.file_url ?? "",
      s.submitted_at,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r: unknown[]) =>
        r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `submissions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Review Center</h1>
        <button
          onClick={handleExport}
          className="touch-target inline-flex items-center gap-2 bg-gray-900 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-gray-800 transition"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {["all", "pending", "approved", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`touch-target whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
              filter === f
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f === "all" ? "Semua" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400">Memuat...</p>
      ) : submissions.length > 0 ? (
        <div className="space-y-3">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold tracking-wider">
                      {sub.id}
                    </span>
                    <StatusBadge status={sub.status} />
                  </div>
                  <p className="font-semibold text-sm">{sub.student_name}</p>
                  <p className="text-xs text-gray-500">{sub.student_class}</p>
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-1">
                Proyek:{" "}
                <span className="font-medium text-gray-700">
                  {(sub.projects as unknown as { title: string })?.title ?? "—"}
                </span>
              </p>

              {sub.notes && (
                <p className="text-xs text-gray-500 mb-2">
                  Catatan: {sub.notes}
                </p>
              )}

              <div className="flex items-center gap-2 mt-3">
                {sub.file_url && (
                  <a
                    href={sub.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="touch-target inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg px-3 py-2 hover:bg-gray-200 transition"
                  >
                    <ExternalLink className="w-3 h-3" /> Lihat File
                  </a>
                )}

                {sub.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleApprove(sub)}
                      className="touch-target inline-flex items-center gap-1 text-xs font-medium text-white bg-gray-900 rounded-lg px-3 py-2 hover:bg-gray-800 transition"
                    >
                      <Check className="w-3 h-3" /> Terima
                    </button>
                    <button
                      onClick={() => handleReject(sub.id)}
                      className="touch-target inline-flex items-center gap-1 text-xs font-medium text-gray-700 bg-gray-200 rounded-lg px-3 py-2 hover:bg-gray-300 transition"
                    >
                      <X className="w-3 h-3" /> Tolak
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">Tidak ada submission.</p>
      )}
    </div>
  );
}

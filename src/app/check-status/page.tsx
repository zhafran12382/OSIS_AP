"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Submission } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";
import { Search, Receipt } from "lucide-react";

export default function CheckStatusPage() {
  const [submissionId, setSubmissionId] = useState("");
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!submissionId.trim()) return;

    setLoading(true);
    setSearched(true);

    const { data } = await supabase
      .from("submissions")
      .select("*, projects(title)")
      .eq("id", submissionId.trim().toUpperCase())
      .single();

    setSubmission(data as Submission | null);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-6 pt-8 pb-10 border-b border-gray-100">
        <div className="max-w-md mx-auto text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Receipt className="w-6 h-6 text-gray-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Cek Status Pengumpulan</h1>
          <p className="text-sm text-gray-500 mb-6">
            Masukkan ID Pengumpulan yang Anda terima setelah mengirim karya.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Contoh: AKT-9281"
              value={submissionId}
              onChange={(e) => setSubmissionId(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-mono tracking-wider text-center focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
            />
            <button
              type="submit"
              className="touch-target bg-gray-900 text-white rounded-xl px-5 py-3 text-sm font-medium hover:bg-gray-800 transition"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 mt-8">
        {loading && (
          <div className="text-center py-8 text-gray-400">Mencari...</div>
        )}

        {searched && !loading && !submission && (
          <div className="text-center py-8">
            <p className="text-gray-500 font-medium">
              ID Pengumpulan tidak ditemukan.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Pastikan Anda memasukkan ID dengan benar.
            </p>
          </div>
        )}

        {submission && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-sm font-bold tracking-wider">
                {submission.id}
              </span>
              <StatusBadge status={submission.status} />
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500">Proyek</span>
                <p className="font-medium">
                  {(submission.projects as unknown as { title: string })?.title ?? "—"}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Nama</span>
                <p className="font-medium">{submission.student_name}</p>
              </div>
              <div>
                <span className="text-gray-500">Kelas</span>
                <p className="font-medium">{submission.student_class}</p>
              </div>
              <div>
                <span className="text-gray-500">Dikirim</span>
                <p className="font-medium">
                  {new Date(submission.submitted_at).toLocaleDateString(
                    "id-ID",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>
              {submission.notes && (
                <div>
                  <span className="text-gray-500">Catatan</span>
                  <p className="font-medium">{submission.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

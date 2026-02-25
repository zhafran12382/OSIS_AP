"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { BannedStudent } from "@/lib/types";
import { Ban, ShieldCheck, Search, Users } from "lucide-react";
import { CLASS_OPTIONS } from "@/lib/student-auth";

interface StudentEntry {
  student_name: string;
  student_class: string;
  submission_count: number;
}

export default function AdminUsersPage() {
  const [students, setStudents] = useState<StudentEntry[]>([]);
  const [bannedStudents, setBannedStudents] = useState<BannedStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");

  const fetchData = useCallback(async () => {
    setLoading(true);

    const [submissionsRes, bannedRes] = await Promise.all([
      supabase
        .from("submissions")
        .select("student_name, student_class")
        .order("student_name"),
      supabase
        .from("banned_students")
        .select("*")
        .order("banned_at", { ascending: false }),
    ]);

    // Aggregate unique students with submission counts
    const map = new Map<string, StudentEntry>();
    for (const row of submissionsRes.data ?? []) {
      const key = `${row.student_name}::${row.student_class}`;
      if (map.has(key)) {
        map.get(key)!.submission_count += 1;
      } else {
        map.set(key, {
          student_name: row.student_name,
          student_class: row.student_class,
          submission_count: 1,
        });
      }
    }

    setStudents(Array.from(map.values()));
    setBannedStudents((bannedRes.data as BannedStudent[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function isBanned(name: string, cls: string) {
    return bannedStudents.some(
      (b) => b.student_name === name && b.student_class === cls
    );
  }

  async function handleBan(name: string, cls: string) {
    const reason = window.prompt(
      `Alasan memblokir "${name}" (${cls})?\n(Kosongkan jika tidak ada alasan khusus)`
    );
    if (reason === null) return; // cancelled

    await supabase.from("banned_students").insert({
      student_name: name,
      student_class: cls,
      reason: reason.trim() || null,
    });

    await fetchData();
  }

  async function handleUnban(name: string, cls: string) {
    const confirm = window.confirm(
      `Buka blokir "${name}" (${cls})? Siswa ini akan bisa login kembali.`
    );
    if (!confirm) return;

    await supabase
      .from("banned_students")
      .delete()
      .eq("student_name", name)
      .eq("student_class", cls);

    await fetchData();
  }

  const filtered = students.filter((s) => {
    const matchSearch =
      search.trim() === "" ||
      s.student_name.toLowerCase().includes(search.toLowerCase());
    const matchClass =
      classFilter === "all" || s.student_class === classFilter;
    return matchSearch && matchClass;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6" /> Daftar Siswa
        </h1>
        <span className="text-sm text-gray-500">
          {students.length} siswa terdaftar &middot; {bannedStudents.length} diblokir
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama siswa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
          />
        </div>
        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-gray-50 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <option value="all">Semua Kelas</option>
          {CLASS_OPTIONS.map((c) => (
            <option key={c} value={c}>
              Kelas {c}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-400">Memuat...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-400">Tidak ada siswa ditemukan.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => {
            const banned = isBanned(s.student_name, s.student_class);
            return (
              <div
                key={`${s.student_name}-${s.student_class}`}
                className={`bg-white rounded-xl shadow-sm border p-4 flex items-center justify-between gap-4 ${
                  banned ? "border-red-200 bg-red-50" : "border-gray-200"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm">{s.student_name}</p>
                    {banned && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-100 rounded-full px-2 py-0.5">
                        <Ban className="w-3 h-3" /> Diblokir
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Kelas {s.student_class} &middot; {s.submission_count} pengumpulan
                  </p>
                  {banned && (
                    <p className="text-xs text-red-500 mt-1">
                      Alasan:{" "}
                      {bannedStudents.find(
                        (b) =>
                          b.student_name === s.student_name &&
                          b.student_class === s.student_class
                      )?.reason ?? "—"}
                    </p>
                  )}
                </div>
                <div>
                  {banned ? (
                    <button
                      onClick={() => handleUnban(s.student_name, s.student_class)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 hover:bg-green-100 transition"
                    >
                      <ShieldCheck className="w-3 h-3" /> Unban
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBan(s.student_name, s.student_class)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 hover:bg-red-100 transition"
                    >
                      <Ban className="w-3 h-3" /> Ban
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { X, LogIn } from "lucide-react";
import {
  useStudentAuth,
  CLASS_OPTIONS,
  isValidStudentName,
  type StudentClass,
} from "@/lib/student-auth";

export function StudentLoginModal() {
  const { showLoginModal, setShowLoginModal, login } = useStudentAuth();
  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState<StudentClass | "">("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!showLoginModal) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Nama wajib diisi.");
      return;
    }

    if (!isValidStudentName(name)) {
      setError("Nama hanya boleh mengandung huruf dan spasi (minimal 2 karakter).");
      return;
    }

    if (!selectedClass) {
      setError("Pilih kelas.");
      return;
    }

    setSubmitting(true);
    const result = await login(name.trim(), selectedClass);
    setSubmitting(false);

    if (result.success) {
      setName("");
      setSelectedClass("");
      setError("");
      setShowLoginModal(false);
    } else {
      setError(result.error ?? "Gagal login.");
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-[60]"
        onClick={() => setShowLoginModal(false)}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative animate-slide-up">
          <button
            onClick={() => setShowLoginModal(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-4">
            <LogIn className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-bold">Login Siswa</h2>
          </div>

          <p className="text-sm text-gray-500 mb-5">
            Masuk untuk mengumpulkan tugas dan mengikuti kegiatan.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nama Lengkap *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                placeholder="Masukkan nama lengkap (huruf saja)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Kelas *
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value as StudentClass)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
              >
                <option value="">— Pilih Kelas —</option>
                {CLASS_OPTIONS.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p className="text-sm text-gray-700 bg-gray-100 rounded-lg px-4 py-2">
                ⚠ {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gray-900 text-white font-semibold rounded-xl px-6 py-3 text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {submitting ? "Memproses..." : (
                <>
                  <LogIn className="w-4 h-4" /> Masuk
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

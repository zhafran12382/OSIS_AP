"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { CountdownTimer } from "@/components/countdown-timer";
import type { Project } from "@/lib/types";
import { Download, ArrowLeft, Send, CheckCircle } from "lucide-react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // Submission form
  const [name, setName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProject() {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();
      setProject(data as Project | null);
      setLoading(false);
    }
    fetchProject();
  }, [projectId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !studentClass.trim()) {
      setError("Nama dan Kelas wajib diisi.");
      return;
    }
    if (!file && !fileUrl.trim()) {
      setError("Upload file atau masukkan URL karya.");
      return;
    }
    if (file && file.size > MAX_FILE_SIZE) {
      setError("Ukuran file maksimal 10 MB.");
      return;
    }
    if (!isSupabaseConfigured) {
      setError(
        "Supabase belum dikonfigurasi. Pastikan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY sudah diisi di file .env.local"
      );
      return;
    }

    setSubmitting(true);

    let uploadedUrl = fileUrl.trim();

    if (file) {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("attachments")
        .upload(`submissions/${fileName}`, file);

      if (uploadError) {
        setError(`Gagal mengunggah file: ${uploadError.message}`);
        setSubmitting(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("attachments")
        .getPublicUrl(`submissions/${fileName}`);
      uploadedUrl = urlData.publicUrl;
    }

    const { data, error: insertError } = await supabase
      .from("submissions")
      .insert({
        project_id: projectId,
        student_name: name.trim(),
        student_class: studentClass.trim(),
        file_url: uploadedUrl || null,
        notes: notes.trim() || null,
      })
      .select("id")
      .single();

    if (insertError) {
      setError(`Gagal mengirim: ${insertError.message}`);
      setSubmitting(false);
      return;
    }

    setSubmittedId(data.id);
    setSubmitting(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center pb-24">
        <p className="text-gray-400">Memuat...</p>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center pb-24 px-6">
        <p className="text-gray-500 font-medium mb-4">Proyek tidak ditemukan.</p>
        <Link href="/projects" className="text-sm text-gray-400 hover:text-black transition">
          ← Kembali ke Katalog
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 pt-6 pb-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-4 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>

        <span className="inline-block bg-gray-900 text-white text-xs font-medium rounded-full px-3 py-1 mb-3">
          {project.category}
        </span>
        <h1 className="text-2xl font-bold mb-2">{project.title}</h1>

        {project.deadline && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-medium">
              Batas Waktu
            </p>
            <CountdownTimer deadline={project.deadline} />
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto px-6 mt-6 space-y-8">
        {/* Description */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Deskripsi
          </h2>
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {project.description || "Tidak ada deskripsi."}
          </div>
        </section>

        {/* Attachment Download */}
        {project.attachment_url && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Lampiran
            </h2>
            <a
              href={project.attachment_url}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target inline-flex items-center gap-2 bg-gray-900 text-white rounded-xl px-5 py-3 text-sm font-medium hover:bg-gray-800 transition"
            >
              <Download className="w-4 h-4" /> Unduh Lampiran
            </a>
          </section>
        )}

        {/* Submission Form */}
        {submittedId ? (
          <section className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center">
            <CheckCircle className="w-10 h-10 mx-auto mb-3 text-gray-700" />
            <h2 className="text-lg font-bold mb-1">Berhasil Dikirim!</h2>
            <p className="text-sm text-gray-500 mb-4">
              Simpan ID berikut untuk mengecek status pengumpulan Anda:
            </p>
            <div className="bg-gray-100 rounded-xl py-4 px-6 inline-block">
              <span className="font-mono text-2xl font-bold tracking-wider">
                {submittedId}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Gunakan halaman{" "}
              <Link
                href="/check-status"
                className="underline hover:text-black transition"
              >
                Cek Status
              </Link>{" "}
              untuk memantau progres.
            </p>
          </section>
        ) : (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Form Pengumpulan
            </h2>
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Kelas *
                </label>
                <input
                  type="text"
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                  placeholder="Contoh: XII IPA 1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Upload File (Maks 10 MB)
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.zip"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-900 file:text-white hover:file:bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Atau URL Karya
                </label>
                <input
                  type="url"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                  placeholder="https://drive.google.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Catatan Tambahan
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition resize-none"
                  placeholder="Tulis catatan opsional..."
                />
              </div>

              {error && (
                <p className="text-sm text-gray-700 bg-gray-100 rounded-lg px-4 py-2">
                  ⚠ {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="touch-target w-full bg-gray-900 text-white font-semibold rounded-xl px-6 py-3 text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {submitting ? (
                  "Mengirim..."
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Kirim Karya
                  </>
                )}
              </button>
            </form>
          </section>
        )}
      </div>
    </main>
  );
}

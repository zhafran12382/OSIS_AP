"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured, SUPABASE_NOT_CONFIGURED_MSG } from "@/lib/supabase";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function NewProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("Tugas");
  const [deadline, setDeadline] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Judul proyek wajib diisi.");
      return;
    }

    if (!isSupabaseConfigured) {
      setError(SUPABASE_NOT_CONFIGURED_MSG);
      return;
    }

    setSaving(true);

    let attachmentUrl: string | null = null;

    if (file) {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("attachments")
        .upload(`projects/${fileName}`, file);

      if (uploadError) {
        setError(`Gagal mengunggah file lampiran: ${uploadError.message}`);
        setSaving(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("attachments")
        .getPublicUrl(`projects/${fileName}`);
      attachmentUrl = urlData.publicUrl;
    }

    const { error: insertError } = await supabase.from("projects").insert({
      title: title.trim(),
      description: description.trim() || null,
      category,
      deadline: deadline || null,
      attachment_url: attachmentUrl,
    });

    if (insertError) {
      setError(`Gagal menyimpan proyek: ${insertError.message}`);
      setSaving(false);
      return;
    }

    router.push("/admin/projects");
  }

  return (
    <div>
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-4 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali
      </Link>

      <h1 className="text-2xl font-bold mb-6">Proyek Baru</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4 max-w-2xl"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Judul *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
            placeholder="Judul proyek"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Deskripsi</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition resize-none"
            placeholder="Deskripsi lengkap proyek (mendukung teks biasa)"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
            >
              <option value="Lomba">Lomba</option>
              <option value="Tugas">Tugas</option>
              <option value="Event">Event</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Deadline</label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Lampiran (PDF/DOCX)
          </label>
          <input
            type="file"
            accept=".pdf,.docx,.doc"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-900 file:text-white hover:file:bg-gray-800"
          />
        </div>

        {error && (
          <p className="text-sm text-gray-700 bg-gray-100 rounded-lg px-4 py-2">
            ⚠ {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="touch-target inline-flex items-center gap-2 bg-gray-900 text-white font-semibold rounded-xl px-6 py-3 text-sm hover:bg-gray-800 disabled:opacity-50 transition"
        >
          {saving ? "Menyimpan..." : <><Save className="w-4 h-4" /> Simpan</>}
        </button>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Judul wajib diisi.");
      return;
    }

    setSaving(true);

    const { error: insertError } = await supabase.from("articles").insert({
      title: title.trim(),
      content: content.trim() || null,
      cover_image_url: coverUrl.trim() || null,
    });

    if (insertError) {
      setError("Gagal menyimpan artikel.");
      setSaving(false);
      return;
    }

    router.push("/admin/articles");
  }

  return (
    <div>
      <Link
        href="/admin/articles"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-4 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali
      </Link>

      <h1 className="text-2xl font-bold mb-6">Artikel Baru</h1>

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
            placeholder="Judul artikel"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Konten</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition resize-none"
            placeholder="Tulis konten artikel..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            URL Cover Image (opsional)
          </label>
          <input
            type="url"
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
            placeholder="https://..."
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

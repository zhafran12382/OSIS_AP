"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured, SUPABASE_NOT_CONFIGURED_MSG } from "@/lib/supabase";
import type { Project } from "@/lib/types";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("Tugas");
  const [deadline, setDeadline] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProject() {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (data) {
        const p = data as Project;
        setTitle(p.title);
        setDescription(p.description ?? "");
        setCategory(p.category);
        setDeadline(
          p.deadline
            ? new Date(p.deadline).toISOString().slice(0, 16)
            : ""
        );
      }
      setLoading(false);
    }
    fetchProject();
  }, [projectId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Judul wajib diisi.");
      return;
    }

    if (!isSupabaseConfigured) {
      setError(SUPABASE_NOT_CONFIGURED_MSG);
      return;
    }

    setSaving(true);

    const { error: updateError } = await supabase
      .from("projects")
      .update({
        title: title.trim(),
        description: description.trim() || null,
        category,
        deadline: deadline || null,
      })
      .eq("id", projectId);

    if (updateError) {
      setError(`Gagal menyimpan: ${updateError.message}`);
      setSaving(false);
      return;
    }

    router.push("/admin/projects");
  }

  if (loading) return <p className="text-gray-400">Memuat...</p>;

  return (
    <div>
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-4 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali
      </Link>

      <h1 className="text-2xl font-bold mb-6">Edit Proyek</h1>

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
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Deskripsi</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition resize-none"
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

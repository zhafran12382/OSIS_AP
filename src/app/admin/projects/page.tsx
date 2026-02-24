"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Project } from "@/lib/types";
import { Plus, Trash2, Pencil } from "lucide-react";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchProjects() {
    setLoading(true);
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    setProjects((data as Project[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  async function deleteProject(id: string) {
    if (!confirm("Yakin hapus proyek ini?")) return;
    await supabase.from("projects").delete().eq("id", id);
    fetchProjects();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manajemen Proyek</h1>
        <Link
          href="/admin/projects/new"
          className="touch-target inline-flex items-center gap-2 bg-gray-900 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-gray-800 transition"
        >
          <Plus className="w-4 h-4" /> Tambah
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-400">Memuat...</p>
      ) : projects.length > 0 ? (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-start justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium rounded-full px-2 py-0.5 mb-1">
                  {project.category}
                </span>
                <h3 className="font-semibold truncate">{project.title}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Deadline:{" "}
                  {project.deadline
                    ? new Date(project.deadline).toLocaleDateString("id-ID")
                    : "—"}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="touch-target p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <Pencil className="w-4 h-4 text-gray-500" />
                </Link>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="touch-target p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <Trash2 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">Belum ada proyek.</p>
      )}
    </div>
  );
}

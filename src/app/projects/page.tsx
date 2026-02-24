"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/lib/types";
import { Search } from "lucide-react";

const CATEGORIES = ["Semua", "Lomba", "Tugas", "Event"] as const;

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("Semua");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      let query = supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (category !== "Semua") {
        query = query.eq("category", category);
      }
      if (search.trim()) {
        query = query.ilike("title", `%${search.trim()}%`);
      }

      const { data } = await query;
      setProjects((data as Project[]) ?? []);
      setLoading(false);
    }

    fetchProjects();
  }, [search, category]);

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b border-gray-100 px-6 pt-8 pb-6">
        <h1 className="text-2xl font-bold mb-4">Katalog Proyek</h1>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari proyek..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`touch-target whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                category === cat
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 mt-6">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Memuat...</div>
        ) : projects.length > 0 ? (
          <div className="grid gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            Tidak ada proyek ditemukan.
          </div>
        )}
      </div>
    </main>
  );
}

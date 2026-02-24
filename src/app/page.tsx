import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ProjectCard } from "@/components/project-card";
import type { Project, Article } from "@/lib/types";
import { ArrowRight, FolderOpen, FileCheck, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  const { count: projectCount } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  const { count: submissionCount } = await supabase
    .from("submissions")
    .select("*", { count: "exact", head: true });

  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* Hero Section */}
      <section className="bg-gray-950 text-white px-6 pt-12 pb-16">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-medium text-gray-400 tracking-widest uppercase mb-3">
            OSIS — Divisi Akademi Prestasi
          </p>
          <h1 className="text-3xl font-extrabold leading-tight mb-4">
            Wujudkan Karya,
            <br />
            Raih Prestasi.
          </h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Platform manajemen proyek untuk mengumpulkan, mengelola, dan menilai
            karya siswa secara digital.
          </p>
          <div className="flex gap-3">
            <Link
              href="/projects"
              className="touch-target inline-flex items-center gap-2 bg-white text-black font-semibold rounded-full px-6 py-3 text-sm hover:bg-gray-200 transition"
            >
              Lihat Proyek <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/check-status"
              className="touch-target inline-flex items-center gap-2 border border-gray-600 text-gray-300 font-medium rounded-full px-6 py-3 text-sm hover:bg-gray-800 transition"
            >
              Cek Status
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-3xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: FolderOpen, label: "Proyek Aktif", value: projectCount ?? 0 },
            { icon: FileCheck, label: "Karya Terkumpul", value: submissionCount ?? 0 },
            { icon: Users, label: "Partisipan", value: "—" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 text-center"
            >
              <stat.icon className="w-5 h-5 mx-auto mb-2 text-gray-500" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Projects */}
      <section className="max-w-3xl mx-auto px-6 mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Proyek Terbaru</h2>
          <Link
            href="/projects"
            className="text-sm text-gray-500 hover:text-black transition"
          >
            Lihat Semua →
          </Link>
        </div>
        {projects && projects.length > 0 ? (
          <div className="grid gap-4">
            {(projects as Project[]).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">Belum ada proyek.</p>
        )}
      </section>

      {/* Recent Articles */}
      <section className="max-w-3xl mx-auto px-6 mt-10">
        <h2 className="text-xl font-bold mb-4">Pengumuman</h2>
        {articles && articles.length > 0 ? (
          <div className="space-y-4">
            {(articles as Article[]).map((article) => (
              <div
                key={article.id}
                className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm"
              >
                <h3 className="font-semibold text-base">{article.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {article.content}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(article.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">Belum ada pengumuman.</p>
        )}
      </section>
    </main>
  );
}

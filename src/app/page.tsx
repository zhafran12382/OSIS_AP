import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ProjectCard } from "@/components/project-card";
import type { Project, Article } from "@/lib/types";
import { ArrowRight, FolderOpen, FileCheck, Users, ChevronRight } from "lucide-react";

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
      <section className="relative bg-gray-950 text-white px-6 pt-14 pb-20 overflow-hidden">
        <div className="hero-shimmer absolute inset-0" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
        <div className="max-w-3xl mx-auto relative z-10">
          <p className="text-sm font-medium text-gray-400 tracking-widest uppercase mb-3 animate-fade-in">
            OSIS — Divisi Akademi Prestasi
          </p>
          <h1 className="text-4xl font-extrabold leading-tight mb-4 animate-slide-up">
            Wujudkan Karya,
            <br />
            Raih Prestasi.
          </h1>
          <p className="text-gray-400 mb-8 leading-relaxed animate-slide-up stagger-1">
            Platform manajemen proyek untuk mengumpulkan, mengelola, dan menilai
            karya siswa secara digital.
          </p>
          <div className="flex gap-3 animate-slide-up stagger-2">
            <Link
              href="/projects"
              className="touch-target inline-flex items-center gap-2 bg-white text-black font-semibold rounded-full px-6 py-3 text-sm hover:bg-gray-200 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Lihat Proyek <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/check-status"
              className="touch-target inline-flex items-center gap-2 border border-gray-600 text-gray-300 font-medium rounded-full px-6 py-3 text-sm hover:bg-gray-800 hover:border-gray-400 transition-all duration-200"
            >
              Cek Status
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-3xl mx-auto px-6 -mt-10">
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: FolderOpen, label: "Proyek Aktif", value: projectCount ?? 0, delay: "stagger-1" },
            { icon: FileCheck, label: "Karya Terkumpul", value: submissionCount ?? 0, delay: "stagger-2" },
            { icon: Users, label: "Partisipan", value: "—", delay: "stagger-3" },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`card-hover bg-white rounded-xl shadow-lg border border-gray-100 p-4 text-center animate-scale-in ${stat.delay}`}
            >
              <stat.icon className="w-5 h-5 mx-auto mb-2 text-gray-500" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Projects */}
      <section className="max-w-3xl mx-auto px-6 mt-12">
        <div className="flex items-center justify-between mb-4 animate-fade-in">
          <h2 className="text-xl font-bold">Proyek Terbaru</h2>
          <Link
            href="/projects"
            className="text-sm text-gray-500 hover:text-black transition inline-flex items-center gap-1"
          >
            Lihat Semua <ChevronRight className="w-4 h-4" />
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
      <section className="max-w-3xl mx-auto px-6 mt-12">
        <h2 className="text-xl font-bold mb-4 animate-fade-in">Pengumuman</h2>
        {articles && articles.length > 0 ? (
          <div className="space-y-4">
            {(articles as Article[]).map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.id}`}
                className="block card-hover bg-white border border-gray-100 rounded-xl p-5 shadow-sm group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-base group-hover:text-gray-600 transition-colors">
                      {article.title}
                    </h3>
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
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">Belum ada pengumuman.</p>
        )}
      </section>
    </main>
  );
}

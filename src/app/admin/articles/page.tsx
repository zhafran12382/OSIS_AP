"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Article } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchArticles() {
    setLoading(true);
    const { data } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });
    setArticles((data as Article[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchArticles();
  }, []);

  async function deleteArticle(id: string) {
    if (!confirm("Yakin hapus artikel ini?")) return;
    await supabase.from("articles").delete().eq("id", id);
    fetchArticles();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manajemen Artikel</h1>
        <Link
          href="/admin/articles/new"
          className="touch-target inline-flex items-center gap-2 bg-gray-900 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-gray-800 transition"
        >
          <Plus className="w-4 h-4" /> Tambah
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-400">Memuat...</p>
      ) : articles.length > 0 ? (
        <div className="space-y-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-start justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold truncate">{article.title}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {article.content}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(article.created_at).toLocaleDateString("id-ID")}
                </p>
              </div>
              <button
                onClick={() => deleteArticle(article.id)}
                className="touch-target p-2 rounded-lg hover:bg-gray-100 transition shrink-0"
              >
                <Trash2 className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">Belum ada artikel.</p>
      )}
    </div>
  );
}

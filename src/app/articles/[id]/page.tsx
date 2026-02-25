import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import type { Article } from "@/lib/types";
import { ArrowLeft, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (!article) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center pb-24 px-6">
        <p className="text-gray-500 font-medium mb-4">
          Artikel tidak ditemukan.
        </p>
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-black transition"
        >
          ← Kembali ke Beranda
        </Link>
      </main>
    );
  }

  const typedArticle = article as Article;

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 pt-6 pb-8">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>

          <h1 className="text-2xl font-bold mb-3 animate-fade-in">
            {typedArticle.title}
          </h1>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            <time>
              {new Date(typedArticle.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 mt-6 animate-slide-up">
        {/* Cover Image */}
        {typedArticle.cover_image_url && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg relative aspect-video">
            <Image
              src={typedArticle.cover_image_url}
              alt={typedArticle.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        {/* Content */}
        <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {typedArticle.content || "Tidak ada konten."}
          </div>
        </article>
      </div>
    </main>
  );
}

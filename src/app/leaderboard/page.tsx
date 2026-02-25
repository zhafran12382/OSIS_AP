import { supabase } from "@/lib/supabase";
import type { LeaderboardEntry, Submission } from "@/lib/types";
import { Trophy, Star, Medal } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const { data: leaderboard } = await supabase
    .from("leaderboard")
    .select("*")
    .order("total_score", { ascending: false })
    .limit(50);

  const { data: hallOfFame } = await supabase
    .from("submissions")
    .select("*, projects(title)")
    .eq("status", "approved")
    .order("submitted_at", { ascending: false })
    .limit(6);

  const entries = (leaderboard as LeaderboardEntry[]) ?? [];
  const fame = (hallOfFame as Submission[]) ?? [];

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      {/* Hall of Fame */}
      <section className="relative bg-gray-950 text-white px-6 pt-8 pb-10 overflow-hidden">
        <div className="hero-shimmer absolute inset-0" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4 blur-2xl" />
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-4 animate-fade-in">
            <Star className="w-5 h-5" />
            <h1 className="text-xl font-bold">Hall of Fame</h1>
          </div>
          <p className="text-sm text-gray-400 mb-6 animate-slide-up">
            Karya terbaik yang telah disetujui oleh tim OSIS.
          </p>

          {fame.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {fame.map((sub, index) => (
                <div
                  key={sub.id}
                  className={`bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:scale-[1.02] animate-scale-in stagger-${Math.min(index + 1, 5)}`}
                >
                  <p className="text-xs text-gray-500 font-mono mb-1">
                    {sub.id}
                  </p>
                  <p className="font-semibold text-sm">{sub.student_name}</p>
                  <p className="text-xs text-gray-400">{sub.student_class}</p>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-1">
                    {(sub.projects as unknown as { title: string })?.title}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Belum ada karya.</p>
          )}
        </div>
      </section>

      {/* Leaderboard */}
      <section className="max-w-3xl mx-auto px-6 mt-8">
        <div className="flex items-center gap-2 mb-4 animate-fade-in">
          <Trophy className="w-5 h-5 text-gray-700" />
          <h2 className="text-xl font-bold">Papan Peringkat</h2>
        </div>

        {entries.length > 0 ? (
          <div className="space-y-3">
            {entries.map((entry, index) => (
              <div
                key={entry.id}
                className="card-hover flex items-center gap-4 bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-slide-up"
                style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}
              >
                <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm shrink-0 ${index < 3 ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
                  {index < 3 ? (
                    <Medal className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {entry.student_name}
                  </p>
                  <p className="text-xs text-gray-500">{entry.student_class}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-lg">{entry.total_score}</p>
                  <p className="text-xs text-gray-500">
                    {entry.approved_projects_count} proyek
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">Belum ada data peringkat.</p>
        )}
      </section>
    </main>
  );
}

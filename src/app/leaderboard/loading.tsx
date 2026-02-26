export default function LeaderboardLoading() {
  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      {/* Hall of Fame skeleton */}
      <section className="bg-gray-950 px-6 pt-8 pb-10">
        <div className="max-w-3xl mx-auto">
          <div className="h-7 w-36 bg-gray-800 rounded mb-4 animate-pulse" />
          <div className="h-4 w-64 bg-gray-800 rounded mb-6 animate-pulse" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <div className="h-3 w-16 bg-gray-700 rounded mb-2 animate-pulse" />
                <div className="h-5 w-24 bg-gray-700 rounded mb-1 animate-pulse" />
                <div className="h-3 w-12 bg-gray-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard skeleton */}
      <section className="max-w-3xl mx-auto px-6 mt-8">
        <div className="h-7 w-44 bg-gray-200 rounded mb-4 animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-gray-200 rounded mb-1 animate-pulse" />
                <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="text-right">
                <div className="h-6 w-10 bg-gray-200 rounded mb-1 animate-pulse" />
                <div className="h-3 w-14 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

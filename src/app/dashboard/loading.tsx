export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-6 pt-8 pb-10 border-b border-gray-100">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gray-200 rounded-full animate-pulse" />
            <div>
              <div className="h-6 w-32 bg-gray-200 rounded mb-1 animate-pulse" />
              <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                <div className="h-8 w-10 mx-auto bg-gray-200 rounded mb-1 animate-pulse" />
                <div className="h-3 w-14 mx-auto bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

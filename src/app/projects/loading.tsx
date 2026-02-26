export default function ProjectsLoading() {
  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b border-gray-100 px-6 pt-8 pb-6">
        <div className="h-8 w-40 bg-gray-200 rounded mb-4 animate-pulse" />
        <div className="h-12 w-full bg-gray-100 rounded-xl mb-4 animate-pulse" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-20 bg-gray-100 rounded-full animate-pulse" />
          ))}
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 mt-6">
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md border border-gray-100 p-5">
              <div className="h-5 w-16 bg-gray-200 rounded-full mb-3 animate-pulse" />
              <div className="h-6 w-48 bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="h-4 w-64 bg-gray-100 rounded mb-2 animate-pulse" />
              <div className="h-3 w-40 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

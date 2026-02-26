export default function ProjectDetailLoading() {
  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b border-gray-100 px-6 pt-6 pb-8">
        <div className="h-4 w-20 bg-gray-200 rounded mb-4 animate-pulse" />
        <div className="h-6 w-16 bg-gray-200 rounded-full mb-3 animate-pulse" />
        <div className="h-8 w-64 bg-gray-200 rounded mb-4 animate-pulse" />
        <div className="grid grid-cols-4 gap-2 mt-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-900 rounded-lg p-3 text-center">
              <div className="h-8 w-10 mx-auto bg-gray-700 rounded mb-1 animate-pulse" />
              <div className="h-3 w-10 mx-auto bg-gray-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 mt-6 space-y-6">
        <div className="space-y-2">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    </main>
  );
}

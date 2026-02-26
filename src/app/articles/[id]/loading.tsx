export default function ArticleLoading() {
  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b border-gray-100 px-6 pt-6 pb-8">
        <div className="max-w-3xl mx-auto">
          <div className="h-4 w-20 bg-gray-200 rounded mb-4 animate-pulse" />
          <div className="h-8 w-64 bg-gray-200 rounded mb-3 animate-pulse" />
          <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-3">
          <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    </main>
  );
}

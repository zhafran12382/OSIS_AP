export default function HomeLoading() {
  return (
    <main className="min-h-screen bg-white pb-24">
      {/* Hero skeleton */}
      <section className="bg-gray-950 px-6 pt-14 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="h-4 w-48 bg-gray-800 rounded mb-3 animate-pulse" />
          <div className="h-10 w-64 bg-gray-800 rounded mb-2 animate-pulse" />
          <div className="h-10 w-48 bg-gray-800 rounded mb-4 animate-pulse" />
          <div className="h-5 w-72 bg-gray-800 rounded mb-8 animate-pulse" />
          <div className="flex gap-3">
            <div className="h-12 w-36 bg-gray-800 rounded-full animate-pulse" />
            <div className="h-12 w-32 bg-gray-800 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats skeleton */}
      <section className="max-w-3xl mx-auto px-6 -mt-10">
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 text-center">
              <div className="h-5 w-5 mx-auto mb-2 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-12 mx-auto bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-16 mx-auto mt-1 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </section>

      {/* Projects skeleton */}
      <section className="max-w-3xl mx-auto px-6 mt-12">
        <div className="h-7 w-40 bg-gray-200 rounded mb-4 animate-pulse" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md border border-gray-100 p-5">
              <div className="h-5 w-16 bg-gray-200 rounded-full mb-3 animate-pulse" />
              <div className="h-6 w-48 bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

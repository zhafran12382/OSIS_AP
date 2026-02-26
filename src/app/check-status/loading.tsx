export default function CheckStatusLoading() {
  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-6 pt-8 pb-10 border-b border-gray-100">
        <div className="max-w-md mx-auto text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-full mx-auto mb-4 animate-pulse" />
          <div className="h-8 w-64 mx-auto bg-gray-200 rounded mb-2 animate-pulse" />
          <div className="h-4 w-72 mx-auto bg-gray-100 rounded mb-6 animate-pulse" />
          <div className="flex gap-2">
            <div className="flex-1 h-12 bg-gray-100 rounded-xl animate-pulse" />
            <div className="h-12 w-14 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto mt-12 px-6">
      <div className="mb-10">
        <div className="h-9 w-80 bg-gray-200 rounded animate-pulse" />
        <div className="h-5 w-64 bg-gray-100 rounded animate-pulse mt-3" />
      </div>
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-100 rounded animate-pulse mt-3" />
          </div>
        ))}
      </div>
    </div>
  )
}
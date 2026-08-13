export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto mt-12 px-6">
      <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
      <div className="mt-4 mb-8">
        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="h-5 w-64 bg-gray-100 rounded animate-pulse mt-3" />
      </div>
      <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
    </div>
  )
}
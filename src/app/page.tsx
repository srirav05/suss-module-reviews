import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default async function HomePage() {
  const { data: modules, error } = await supabase
    .from('modules')
    .select('*')

  const { data: reviews } = await supabase
    .from('reviews')
    .select('module_id, rating')

  const getAverageRating = (moduleId: number) => {
    const moduleReviews = reviews?.filter((r) => r.module_id === moduleId) ?? []
    if (moduleReviews.length === 0) return null
    const avg = moduleReviews.reduce((sum, r) => sum + r.rating, 0) / moduleReviews.length
    return { avg: avg.toFixed(1), count: moduleReviews.length }
  }
  return (
    <div className="max-w-3xl mx-auto mt-12 px-6">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
  SUSS <span className="text-indigo-600">ICT</span> Module Reviews
</h1>
        <p className="text-gray-500 mt-2">
          Real reviews from ICT students, for ICT students.
        </p>
      </div>

      {error && (
        <p className="text-red-500">Error loading modules: {error.message}</p>
      )}

      {modules && modules.length === 0 && (
        <p className="text-gray-500">No modules added yet.</p>
      )}

      <div className="grid gap-4">
        {modules?.map((module) => (
          <Link key={module.id} href={`/modules/${module.id}`}>
<div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer">
  <div className="flex items-center justify-between">
    <h2 className="text-lg font-semibold">{module.code}</h2>
    <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full font-medium">
      {module.category}
    </span>
  </div>
  <p className="text-gray-700 mt-1">{module.title}</p>

  {(() => {
    const rating = getAverageRating(module.id)
    return rating ? (
      <div className="flex items-center gap-1 mt-2 text-sm">
        <span className="text-yellow-400">★</span>
        <span className="font-medium">{rating.avg}</span>
        <span className="text-gray-400">({rating.count} review{rating.count !== 1 ? 's' : ''})</span>
      </div>
    ) : (
      <p className="text-sm text-gray-400 mt-2">No reviews yet</p>
    )
  })()}
</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
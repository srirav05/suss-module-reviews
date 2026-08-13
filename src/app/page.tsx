import { supabase } from '@/lib/supabase'
import ModuleList from './ModuleList'

export default async function HomePage() {
  const { data: modules, error } = await supabase.from('modules').select('*')
  const { data: reviews } = await supabase.from('reviews').select('module_id, rating')

  const ratingsMap: Record<number, { avg: string; count: number }> = {}

  modules?.forEach((module) => {
    const moduleReviews = reviews?.filter((r) => r.module_id === module.id) ?? []
    if (moduleReviews.length > 0) {
      const avg = moduleReviews.reduce((sum, r) => sum + r.rating, 0) / moduleReviews.length
      ratingsMap[module.id] = { avg: avg.toFixed(1), count: moduleReviews.length }
    }
  })

  return (
    <div className="max-w-3xl mx-auto mt-12 px-6">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          SUSS <span className="text-indigo-600">ICT</span> Module Reviews
        </h1>
        <p className="text-gray-500 mt-2">Real reviews from ICT students, for ICT students.</p>
      </div>

      {error && <p className="text-red-500">Error loading modules: {error.message}</p>}

      {modules && <ModuleList modules={modules} ratingsMap={ratingsMap} />}
    </div>
  )
}
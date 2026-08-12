import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default async function HomePage() {
  const { data: modules, error } = await supabase
    .from('modules')
    .select('*')

  return (
    <div className="max-w-3xl mx-auto mt-12 px-6">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">SUSS ICT Module Reviews</h1>
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
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {module.category}
                </span>
              </div>
              <p className="text-gray-700 mt-1">{module.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
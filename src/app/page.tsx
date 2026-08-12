import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default async function HomePage() {
  const { data: modules, error } = await supabase
    .from('modules')
    .select('*')

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6">SUSS ICT Module Reviews</h1>

      {error && (
        <p className="text-red-500">Error loading modules: {error.message}</p>
      )}

      {modules && modules.length === 0 && (
        <p className="text-gray-500">No modules added yet.</p>
      )}

      <div className="space-y-4">
{modules?.map((module) => (
  <Link key={module.id} href={`/modules/${module.id}`}>
    <div className="border rounded p-4 hover:bg-gray-50 cursor-pointer">
      <h2 className="text-xl font-semibold">{module.code}</h2>
      <p className="text-gray-700">{module.title}</p>
      <p className="text-sm text-gray-500">{module.category}</p>
    </div>
    </Link>
        ))}
      </div>
    </div>
  )
}
import { supabase } from '@/lib/supabase'
import ReviewForm from './ReviewForm'
import Link from 'next/link'

export default async function ModuleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: module } = await supabase
    .from('modules')
    .select('*')
    .eq('id', id)
    .single()

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('module_id', id)
    .order('created_at', { ascending: false })

  if (!module) {
    return <div className="p-6">Module not found.</div>
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 px-6">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
        ← Back to modules
      </Link>

      <div className="mt-4 mb-8">
        <h1 className="text-3xl font-bold">{module.code}</h1>
        <p className="text-lg text-gray-700 mt-1">{module.title}</p>
        <p className="text-gray-500 mt-2">{module.description}</p>
      </div>

      <h2 className="text-xl font-semibold mb-3">Reviews</h2>

      <ReviewForm moduleId={id} />

      {reviews && reviews.length === 0 && (
        <p className="text-gray-500">No reviews yet. Be the first!</p>
      )}

      <div className="space-y-3">
        {reviews?.map((review) => (
          <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex gap-0.5 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-gray-700">{review.review_text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
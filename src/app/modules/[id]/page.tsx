import { supabase } from '@/lib/supabase'
import ReviewForm from './ReviewForm'

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
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold">{module.code}</h1>
      <p className="text-lg text-gray-700">{module.title}</p>
      <p className="text-gray-500 mb-6">{module.description}</p>

      <h2 className="text-xl font-semibold mb-3">Reviews</h2>
      
      <ReviewForm moduleId={id} />

      {reviews && reviews.length === 0 && (
        <p className="text-gray-500">No reviews yet. Be the first!</p>
      )}

      <div className="space-y-3">
        {reviews?.map((review) => (
          <div key={review.id} className="border rounded p-3">
            <p className="font-semibold">Rating: {review.rating} / 5</p>
            <p>{review.review_text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
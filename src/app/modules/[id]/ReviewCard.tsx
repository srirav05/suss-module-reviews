'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { containsInappropriateContent } from '@/lib/moderation'

type Review = {
  id: number
  rating: number
  review_text: string
}

export default function ReviewCard({
  review,
  isOwner,
}: {
  review: Review
  isOwner: boolean
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [rating, setRating] = useState(review.rating)
  const [reviewText, setReviewText] = useState(review.review_text)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [error, setError] = useState('')
const handleUpdate = async () => {
  setError('')

  if (containsInappropriateContent(reviewText)) {
    setError('Your review contains inappropriate language. Please revise it before saving.')
    return
  }

  setLoading(true)
  const { error: updateError } = await supabase
    .from('reviews')
    .update({ rating, review_text: reviewText })
    .eq('id', review.id)

  setLoading(false)
  if (!updateError) {
    setIsEditing(false)
    router.refresh()
  } else {
    setError(updateError.message)
  }
}

  const handleDelete = async () => {
    if (!confirm('Delete this review? This cannot be undone.')) return
    setLoading(true)
    await supabase.from('reviews').delete().eq('id', review.id)
    setLoading(false)
    router.refresh()
  }

  if (isEditing) {
    return (
      <div className="bg-white border border-indigo-200 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="w-full border rounded px-3 py-2"
          rows={3}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="text-gray-500 px-3 py-1.5 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between">
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
        {isOwner && (
          <div className="flex gap-3 text-xs">
            <button onClick={() => setIsEditing(true)} className="text-indigo-600 hover:underline">
              Edit
            </button>
            <button onClick={handleDelete} className="text-red-500 hover:underline">
              Delete
            </button>
          </div>
        )}
      </div>
      <p className="text-gray-700">{review.review_text}</p>
    </div>
  )
}
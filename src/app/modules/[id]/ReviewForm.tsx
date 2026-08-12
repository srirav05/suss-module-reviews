'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ReviewForm({ moduleId }: { moduleId: string }) {
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError('You must be logged in to submit a review.')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('reviews').insert({
      module_id: moduleId,
      user_id: user.id,
      rating,
      review_text: reviewText,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setReviewText('')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border rounded p-4 mb-6 space-y-3">
      <h3 className="font-semibold">Leave a review</h3>

      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="border rounded px-2 py-1"
      >
        <option value={5}>5 - Excellent</option>
        <option value={4}>4 - Good</option>
        <option value={3}>3 - Average</option>
        <option value={2}>2 - Poor</option>
        <option value={1}>1 - Terrible</option>
      </select>

      <textarea
        placeholder="Write your review..."
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        className="w-full border rounded px-3 py-2"
        rows={3}
        required
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}
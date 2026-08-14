'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getRecommendations, type Recommendation } from '@/lib/recommend'

type ModuleRow = {
  id: number
  code: string
  title: string
  description: string
  category: string
}

type ReviewRow = {
  module_id: number
  rating: number
  review_text: string
}

export default function ModuleAssistant({
  modules,
  reviews,
}: {
  modules: ModuleRow[]
  reviews: ReviewRow[]
}) {
  const [question, setQuestion] = useState('')
  const [results, setResults] = useState<Recommendation[] | null>(null)
  const [searched, setSearched] = useState(false)

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault()
    const recs = getRecommendations(question, modules, reviews)
    setResults(recs)
    setSearched(true)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-8">
      <h2 className="font-semibold mb-1">🤖 Module Assistant</h2>
      <p className="text-sm text-gray-500 mb-4">
        Describe what you're looking for, e.g. "low programming, more project-based assessment"
      </p>

      <form onSubmit={handleAsk} className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="I'm looking for a module with..."
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Ask
        </button>
      </form>

      {searched && results && results.length === 0 && (
        <p className="text-sm text-gray-400 mt-4">
          No strong matches found — try rephrasing, or mention things like
          "low programming," "project-based," "exam-based," or a category like "security" or "design."
        </p>
      )}

      {results && results.length > 0 && (
        <div className="mt-4 space-y-3">
          {results.map(({ module, reasons }) => (
            <Link key={module.id} href={`/modules/${module.id}`}>
              <div className="border border-indigo-100 bg-indigo-50/50 rounded-lg p-3 hover:bg-indigo-50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{module.code}</span>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                    {module.category}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{module.title}</p>
                <ul className="mt-2 space-y-0.5">
                  {reasons.slice(0, 2).map((reason, i) => (
                    <li key={i} className="text-xs text-gray-500">• {reason}</li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
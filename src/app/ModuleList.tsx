'use client'

import { useState } from 'react'
import Link from 'next/link'

type Module = {
  id: number
  code: string
  title: string
  category: string
}

type RatingInfo = { avg: string; count: number }

export default function ModuleList({
  modules,
  ratingsMap,
}: {
  modules: Module[]
  ratingsMap: Record<number, RatingInfo>
}) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const categories = ['All', ...Array.from(new Set(modules.map((m) => m.category)))]

  const filtered = modules.filter((m) => {
    const matchesSearch =
      m.code.toLowerCase().includes(search.toLowerCase()) ||
      m.title.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'All' || m.category === category
    return matchesSearch && matchesCategory
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by code or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 && (
        <p className="text-gray-400 text-sm">No modules match your search.</p>
      )}

      <div className="grid gap-4">
        {filtered.map((module) => {
  const rating = ratingsMap[module.id]
  return (
            <Link key={module.id} href={`/modules/${module.id}`}>
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{module.code}</h2>
                  <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full font-medium">
                    {module.category}
                  </span>
                </div>
                <p className="text-gray-700 mt-1">{module.title}</p>
                {rating ? (
                  <div className="flex items-center gap-1 mt-2 text-sm">
                    <span className="text-yellow-400">★</span>
                    <span className="font-medium">{rating.avg}</span>
                    <span className="text-gray-400">
                      ({rating.count} review{rating.count !== 1 ? 's' : ''})
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 mt-2">No reviews yet</p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
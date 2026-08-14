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

export type Recommendation = {
  module: ModuleRow
  score: number
  reasons: string[]
}

// Keyword groups: each maps a "concept" the student might type
// to words we look for in module data + review text.
const KEYWORD_GROUPS: Record<string, string[]> = {
  lowProgramming: ['low programming', 'less coding', 'not much coding', 'non-programming', 'less code'],
  highProgramming: ['heavy programming', 'a lot of coding', 'coding intensive', 'programming heavy'],
  projectBased: ['project-based', 'project based', 'projects', 'coursework', 'assignment based'],
  examBased: ['exam', 'test-based', 'final exam', 'written exam'],
  easy: ['easy', 'beginner friendly', 'simple', 'not difficult', 'manageable'],
  hard: ['difficult', 'hard', 'challenging', 'tough'],
  security: ['security', 'cybersecurity', 'hacking', 'network security'],
  design: ['design', 'ui', 'ux', 'interface'],
  webDev: ['web', 'website', 'web development', 'frontend', 'backend'],
}

// Category-level signals: which module categories align with which concepts
const CATEGORY_SIGNALS: Record<string, string[]> = {
  lowProgramming: ['Design', 'Security'],
  highProgramming: ['Programming', 'Software Engineering'],
  security: ['Security'],
  design: ['Design'],
  webDev: ['Programming'],
}

function detectConcepts(question: string): string[] {
  const lower = question.toLowerCase()
  const matched: string[] = []

  for (const [concept, phrases] of Object.entries(KEYWORD_GROUPS)) {
    if (phrases.some((phrase) => lower.includes(phrase))) {
      matched.push(concept)
    }
  }

  return matched
}

export function getRecommendations(
  question: string,
  modules: ModuleRow[],
  reviews: ReviewRow[]
): Recommendation[] {
  const concepts = detectConcepts(question)

  if (concepts.length === 0) {
    return []
  }

  const results: Recommendation[] = modules.map((module) => {
    let score = 0
    const reasons: string[] = []

    const moduleReviews = reviews.filter((r) => r.module_id === module.id)
    const allReviewText = moduleReviews.map((r) => r.review_text.toLowerCase()).join(' ')
    const avgRating =
      moduleReviews.length > 0
        ? moduleReviews.reduce((sum, r) => sum + r.rating, 0) / moduleReviews.length
        : null

    concepts.forEach((concept) => {
      // Check category-level match
      const categoryMatch = CATEGORY_SIGNALS[concept]?.includes(module.category)
      if (categoryMatch) {
        score += 2
        reasons.push(`Category "${module.category}" fits "${concept.replace(/([A-Z])/g, ' $1').toLowerCase()}"`)
      }

      // Check if reviews mention matching keywords
      const phrases = KEYWORD_GROUPS[concept]
      const reviewMatch = phrases.some((phrase) => allReviewText.includes(phrase))
      if (reviewMatch) {
        score += 3
        reasons.push(`Student reviews mention "${concept.replace(/([A-Z])/g, ' $1').toLowerCase()}"`)
      }

      // Check module description too
      const descMatch = phrases.some((phrase) => module.description.toLowerCase().includes(phrase))
      if (descMatch) {
        score += 1
        reasons.push(`Module description mentions related terms`)
      }
    })

    // Small bonus for well-rated modules, as a tiebreaker
    if (avgRating && avgRating >= 4) {
      score += 1
      reasons.push(`Highly rated (${avgRating.toFixed(1)}/5)`)
    }

    return { module, score, reasons }
  })

  return results
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}
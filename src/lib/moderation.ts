const { Filter } = require('bad-words')

const filter = new Filter()

export function containsInappropriateContent(text: string): boolean {
  return filter.isProfane(text)
}
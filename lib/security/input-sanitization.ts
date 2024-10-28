import DOMPurify from 'isomorphic-dompurify'
import { z } from 'zod'

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href'],
  })
}

export function createSafeSchema<T extends z.ZodType>(schema: T) {
  return schema.transform((data) => {
    if (typeof data === 'string') {
      return sanitizeHtml(data)
    }
    if (typeof data === 'object' && data !== null) {
      return Object.entries(data).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: typeof value === 'string' ? sanitizeHtml(value) : value,
      }), {})
    }
    return data
  })
}
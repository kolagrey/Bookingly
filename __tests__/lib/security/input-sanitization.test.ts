import { sanitizeHtml, createSafeSchema } from '@/lib/security/input-sanitization'
import { z } from 'zod'

describe('input-sanitization', () => {
  describe('sanitizeHtml', () => {
    it('removes dangerous HTML', () => {
      const dirty = '<script>alert("xss")</script><p>Hello</p>'
      const clean = sanitizeHtml(dirty)
      expect(clean).toBe('Hello')
    })

    it('allows safe HTML tags', () => {
      const safe = '<b>Bold</b> and <i>italic</i>'
      const result = sanitizeHtml(safe)
      expect(result).toBe('<b>Bold</b> and <i>italic</i>')
    })

    it('allows safe links', () => {
      const link = '<a href="https://example.com">Link</a>'
      const result = sanitizeHtml(link)
      expect(result).toBe(link)
    })
  })

  describe('createSafeSchema', () => {
    it('sanitizes string fields', () => {
      const schema = createSafeSchema(z.string())
      const result = schema.parse('<script>alert("xss")</script>Hello')
      expect(result).toBe('Hello')
    })

    it('sanitizes object fields', () => {
      const schema = createSafeSchema(z.object({
        title: z.string(),
        content: z.string(),
      }))
      
      const result = schema.parse({
        title: '<script>bad</script>Title',
        content: '<b>Good</b> content',
      })
      
      expect(result).toEqual({
        title: 'Title',
        content: '<b>Good</b> content',
      })
    })
  })
})
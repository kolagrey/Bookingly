import { expertService } from '@/lib/api/expert-service'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

jest.mock('@supabase/auth-helpers-nextjs')

describe('expertService', () => {
  const mockSupabase = {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn(() => ({
          data: { id: 'test-expert' },
          error: null,
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          data: { id: 'test-expert' },
          error: null,
        })),
      })),
      upsert: jest.fn(() => ({
        data: { id: 'test-schedule' },
        error: null,
      })),
    })),
  }

  beforeEach(() => {
    ;(createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase)
  })

  describe('getExpertProfile', () => {
    it('fetches expert profile successfully', async () => {
      const profile = await expertService.getExpertProfile('test-id')
      expect(profile).toEqual({ id: 'test-expert' })
      expect(mockSupabase.from).toHaveBeenCalledWith('experts')
    })
  })

  describe('updateExpertProfile', () => {
    it('updates expert profile successfully', async () => {
      const { data, error } = await expertService.updateExpertProfile('test-id', {
        bio: 'Updated bio',
      })
      expect(error).toBeNull()
      expect(data).toEqual({ id: 'test-expert' })
    })
  })

  describe('updateAvailability', () => {
    it('updates availability schedule successfully', async () => {
      const { data, error } = await expertService.updateAvailability('test-id', {
        weekday: [],
        exceptions: [],
      })
      expect(error).toBeNull()
      expect(data).toEqual({ id: 'test-schedule' })
    })
  })
})
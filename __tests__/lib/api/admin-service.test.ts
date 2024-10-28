import { adminService } from '@/lib/api/admin-service'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

jest.mock('@supabase/auth-helpers-nextjs')

describe('adminService', () => {
  const mockSupabase = {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn(() => ({
          data: { totalUsers: 100 },
          error: null,
        })),
        eq: jest.fn(() => ({
          data: [{ id: 'test-expert' }],
          error: null,
        })),
        or: jest.fn(() => ({
          data: [{ id: 'test-user' }],
          error: null,
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          data: { id: 'test-expert', verified: true },
          error: null,
        })),
      })),
    })),
    rpc: jest.fn(() => ({
      data: { stats: 'test-stats' },
      error: null,
    })),
  }

  beforeEach(() => {
    ;(createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase)
  })

  describe('getStats', () => {
    it('fetches admin statistics successfully', async () => {
      const stats = await adminService.getStats()
      expect(stats).toEqual({ stats: 'test-stats' })
      expect(mockSupabase.rpc).toHaveBeenCalledWith('get_admin_stats')
    })
  })

  describe('getExperts', () => {
    it('fetches experts with search filter', async () => {
      const experts = await adminService.getExperts({ search: 'test' })
      expect(experts).toEqual([{ id: 'test-expert' }])
    })

    it('fetches all experts without search', async () => {
      const experts = await adminService.getExperts()
      expect(experts).toEqual([{ id: 'test-expert' }])
    })
  })

  describe('verifyExpert', () => {
    it('updates expert verification status', async () => {
      await adminService.verifyExpert('test-id', true, 'Verified expert')
      expect(mockSupabase.from).toHaveBeenCalledWith('experts')
    })
  })
})
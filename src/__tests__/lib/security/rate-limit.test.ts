import { rateLimit } from '@/lib/security/rate-limit'
import { Redis } from '@upstash/redis'

jest.mock('@upstash/redis')

describe('rateLimit', () => {
  const mockRedis = {
    pipeline: jest.fn(() => ({
      zremrangebyscore: jest.fn().mockReturnThis(),
      zadd: jest.fn().mockReturnThis(),
      zcount: jest.fn().mockReturnThis(),
      expire: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([null, null, 5]),
    })),
  }

  beforeEach(() => {
    ;(Redis as jest.Mock).mockImplementation(() => mockRedis)
  })

  it('allows requests within limit', async () => {
    const result = await rateLimit('127.0.0.1')
    
    expect(result).toEqual({
      success: true,
      limit: 100,
      remaining: 95,
      reset: expect.any(Number),
    })
  })

  it('blocks requests over limit', async () => {
    mockRedis.pipeline().exec.mockResolvedValueOnce([null, null, 100])
    
    const result = await rateLimit('127.0.0.1')
    
    expect(result).toEqual({
      success: false,
      limit: 100,
      remaining: 0,
      reset: expect.any(Number),
    })
  })
})
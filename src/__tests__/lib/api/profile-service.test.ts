import { profileService } from '@/lib/api/profile-service'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

jest.mock('@supabase/auth-helpers-nextjs')

describe('profileService', () => {
  const mockSupabase = {
    from: jest.fn(() => ({
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({
              data: { id: 'test-user' },
              error: null,
            })),
          })),
        })),
      })),
    })),
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(() => ({ error: null })),
        getPublicUrl: jest.fn(() => ({
          data: { publicUrl: 'https://test.com/photo.jpg' },
        })),
      })),
    },
  }

  beforeEach(() => {
    ;(createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase)
  })

  describe('updateProfile', () => {
    it('updates user profile successfully', async () => {
      const profile = {
        full_name: 'Test User',
        location: 'Test City',
      }

      const { data, error } = await profileService.updateProfile('user-1', profile)

      expect(error).toBeNull()
      expect(data).toEqual({ id: 'test-user' })
      expect(mockSupabase.from).toHaveBeenCalledWith('users')
    })
  })

  describe('uploadProfilePhoto', () => {
    it('uploads photo and returns public URL', async () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

      const { data } = await profileService.uploadProfilePhoto('user-1', file)

      expect(data).toEqual({ publicUrl: 'https://test.com/photo.jpg' })
      expect(mockSupabase.storage.from).toHaveBeenCalledWith('profile-photos')
    })

    it('handles upload errors', async () => {
      mockSupabase.storage.from.mockImplementationOnce(() => ({
        upload: jest.fn(() => ({
          error: new Error('Upload failed'),
        })),
      }))

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const { error } = await profileService.uploadProfilePhoto('user-1', file)

      expect(error).toBeDefined()
    })
  })
})
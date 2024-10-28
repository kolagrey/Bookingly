import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { type User } from '@/types/database'

const supabase = createClientComponentClient()

export const profileService = {
  async updateProfile(userId: string, profile: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(profile)
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },

  async uploadProfilePhoto(userId: string, file: File) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/profile.${fileExt}`

    // Upload to profile-photos bucket
    const { error: uploadError } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, file, {
        upsert: true,
        contentType: file.type,
      })

    if (uploadError) {
      return { error: uploadError }
    }

    // Get public URL
    const { data } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(fileName)

    return { data }
  },
}
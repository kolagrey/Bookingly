import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { type Expert, type AvailabilitySchedule } from '@/types/database'
import { type SearchParams } from '@/types/experts'
import { addDays, startOfDay, endOfDay } from 'date-fns'

const supabase = createClientComponentClient()

export const expertService = {
  async getExpertProfile(userId: string): Promise<Expert | null> {
    const { data } = await supabase
      .from('experts')
      .select(`
        *,
        users:user_id (*)
      `)
      .eq('user_id', userId)
      .single()
    return data
  },

  async updateExpertProfile(userId: string, profile: Partial<Expert>) {
    const { data, error } = await supabase
      .from('experts')
      .update(profile)
      .eq('user_id', userId)
    return { data, error }
  },

  async updateAvailability(expertId: string, schedule: AvailabilitySchedule) {
    const { data, error } = await supabase
      .from('availability_schedules')
      .upsert({
        expert_id: expertId,
        weekday_schedule: schedule.weekday,
        exceptions: schedule.exceptions,
      })
    return { data, error }
  },

  async getAvailability(expertId: string): Promise<AvailabilitySchedule | null> {
    const { data } = await supabase
      .from('availability_schedules')
      .select('*')
      .eq('expert_id', expertId)
      .single()
    return data
  },

  async searchExperts({ searchTerm, filters, sort }: SearchParams = {}) {
    let query = supabase
      .from('experts')
      .select(`
        *,
        users!inner(*),
        expertise:expert_expertise(
          category_id,
          years_experience,
          category:expertise_categories(*)
        ),
        availability_schedules(
          weekday_schedule,
          exceptions
        )
      `)
      .eq('verified', true)

    // Apply search filter
    if (searchTerm) {
      query = query.or(`
        users.full_name.ilike.%${searchTerm}%,
        bio.ilike.%${searchTerm}%
      `)
    }

    // Apply expertise filter
    if (filters?.expertise?.length) {
      query = query.contains('expertise', filters.expertise)
    }

    // Apply rating filter
    if (filters?.minRating) {
      query = query.gte('rating', filters.minRating)
    }

    // Apply price filter
    if (filters?.maxPrice) {
      query = query.lte('hourly_rate', filters.maxPrice)
    }

    // Apply availability filter
    if (filters?.availability && filters.availability !== 'any') {
      const today = startOfDay(new Date())
      let endDate: Date

      switch (filters.availability) {
        case 'today':
          endDate = endOfDay(today)
          break
        case 'this-week':
          endDate = endOfDay(addDays(today, 7))
          break
        case 'next-week':
          endDate = endOfDay(addDays(today, 14))
          break
        default:
          endDate = endOfDay(today)
      }

      // Get experts with available slots in the date range
      query = query.not('availability_schedules', 'is', null)
    }

    // Apply sorting
    switch (sort) {
      case 'rating':
        query = query.order('rating', { ascending: false })
        break
      case 'experience':
        query = query.order('years_experience', { ascending: false })
        break
      case 'price-low':
        query = query.order('hourly_rate', { ascending: true })
        break
      case 'price-high':
        query = query.order('hourly_rate', { ascending: false })
        break
      default:
        query = query.order('rating', { ascending: false })
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  },

  async getFeaturedExperts() {
    const { data } = await supabase
      .from('experts')
      .select(`
        *,
        users!inner(*),
        expertise:expert_expertise(
          category_id,
          years_experience,
          category:expertise_categories(*)
        )
      `)
      .eq('verified', true)
      .order('rating', { ascending: false })
      .limit(3)

    return data || []
  },

  async getExpertiseCategories() {
    const { data } = await supabase
      .from('expertise_categories')
      .select('*')
      .order('name')

    return data || []
  },
}
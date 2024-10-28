import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { type Expert, type User, type Booking, type BookingStatus, type Review } from '@/types/database'

const supabase = createClientComponentClient()

interface AdminStats {
  totalUsers: number
  activeExperts: number
  totalBookings: number
}

interface SearchParams {
  search?: string
  status?: BookingStatus | 'all'
  action?: string
}

interface ClientWithStats extends User {
  total_bookings: number
  last_booking_date: string | null
}

interface BookingWithUsers extends Booking {
  expert: {
    full_name: string
  }
  client: {
    full_name: string
  }
}

interface AuditLog {
  id: string
  user_id: string
  action: string
  resource: string
  ip_address: string
  user_agent: string
  metadata?: Record<string, any>
  created_at: string
  user?: {
    full_name: string
  }
}

interface ContentItem {
  id: string
  title: string
  body: string
  type: 'portfolio' | 'testimonial' | 'article'
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  author: {
    id: string
    full_name: string
    email: string
  }
}

export const adminService = {
  async getStats(): Promise<AdminStats> {
    const { data } = await supabase.rpc('get_admin_stats')
    return data
  },

  async getExperts({ search }: SearchParams = {}): Promise<Expert[]> {
    let query = supabase
      .from('experts')
      .select(`
        *,
        users!inner (*)
      `)

    if (search) {
      query = query.or(`
        users.full_name.ilike.%${search}%,
        users.email.ilike.%${search}%
      `)
    }

    const { data } = await query
    return data || []
  },

  async getPendingExperts(): Promise<Expert[]> {
    const { data } = await supabase
      .from('experts')
      .select(`
        *,
        users!inner (
          id,
          full_name,
          email,
          avatar_url,
          created_at
        ),
        expert_expertise:expert_expertise(
          category_id,
          years_experience,
          category:expertise_categories(
            name,
            description
          )
        )
      `)
      .eq('verified', false)
      .order('created_at', { ascending: false })

    return data || []
  },

  async getPendingContent(): Promise<ContentItem[]> {
    const { data } = await supabase
      .from('content_items')
      .select(`
        *,
        author:users(
          id,
          full_name,
          email
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    return data || []
  },

  async getPendingReviews(): Promise<Review[]> {
    const { data } = await supabase
      .from('reviews')
      .select(`
        *,
        client:users!client_id(
          full_name,
          email,
          avatar_url
        ),
        expert:experts(
          users(
            full_name,
            email
          )
        ),
        booking:bookings(*),
        ratings:review_ratings(
          category_id,
          rating,
          category:review_categories(
            name
          )
        )
      `)
      .eq('moderation_status', 'pending')
      .order('created_at', { ascending: false })

    return data || []
  },

  async moderateReview(
    reviewId: string,
    status: 'approved' | 'rejected',
    notes?: string
  ): Promise<void> {
    const { data: review } = await supabase
      .from('reviews')
      .select('expert_id, rating')
      .eq('id', reviewId)
      .single()

    if (!review) {
      throw new Error('Review not found')
    }

    // Start a transaction
    const { error: updateError } = await supabase.rpc('moderate_review', {
      review_id: reviewId,
      moderation_status: status,
      moderation_notes: notes,
      expert_id: review.expert_id,
      review_rating: review.rating,
    })

    if (updateError) throw updateError

    // If approved, update expert's average rating
    if (status === 'approved') {
      const { data: expertReviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('expert_id', review.expert_id)
        .eq('moderation_status', 'approved')

      if (expertReviews) {
        const averageRating = expertReviews.reduce((acc, r) => acc + r.rating, 0) / expertReviews.length

        await supabase
          .from('experts')
          .update({
            rating: averageRating,
            total_reviews: expertReviews.length,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', review.expert_id)
      }
    }
  },

  async moderateContent(
    contentId: string,
    status: 'approved' | 'rejected',
    notes?: string
  ): Promise<void> {
    await supabase
      .from('content_items')
      .update({
        status,
        moderation_notes: notes,
        moderated_at: new Date().toISOString(),
        moderated_by: supabase.auth.getUser().then(res => res.data.user?.id),
      })
      .eq('id', contentId)

    // If content is approved, update related records
    if (status === 'approved') {
      const { data: content } = await supabase
        .from('content_items')
        .select('type, reference_id')
        .eq('id', contentId)
        .single()

      if (content) {
        switch (content.type) {
          case 'portfolio':
            await supabase
              .from('portfolio_items')
              .update({ visible: true })
              .eq('id', content.reference_id)
            break
          case 'testimonial':
            await supabase
              .from('testimonials')
              .update({ visible: true })
              .eq('id', content.reference_id)
            break
          case 'article':
            await supabase
              .from('articles')
              .update({ published: true })
              .eq('id', content.reference_id)
            break
        }
      }
    }
  },

  async getClients({ search }: SearchParams = {}): Promise<ClientWithStats[]> {
    let query = supabase
      .from('users')
      .select(`
        *,
        bookings:bookings(count),
        last_booking:bookings(start_time)
      `)
      .eq('role', 'client')

    if (search) {
      query = query.or(`
        full_name.ilike.%${search}%,
        email.ilike.%${search}%
      `)
    }

    const { data } = await query
    return data || []
  },

  async getBookings({ search, status }: SearchParams = {}): Promise<BookingWithUsers[]> {
    let query = supabase
      .from('bookings')
      .select(`
        *,
        expert:experts(
          users(full_name)
        ),
        client:users!client_id(
          full_name
        )
      `)
      .order('created_at', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`
        expert.users.full_name.ilike.%${search}%,
        client.full_name.ilike.%${search}%
      `)
    }

    const { data } = await query
    return (data || []) as BookingWithUsers[]
  },

  async getAuditLogs({ action, search }: SearchParams = {}): Promise<AuditLog[]> {
    let query = supabase
      .from('audit_logs')
      .select(`
        *,
        user:users(
          full_name
        )
      `)
      .order('created_at', { ascending: false })

    if (action && action !== 'all') {
      query = query.eq('action', action)
    }

    if (search) {
      query = query.or(`
        user.full_name.ilike.%${search}%,
        resource.ilike.%${search}%
      `)
    }

    const { data } = await query.limit(100)
    return data || []
  },

  async getExpertDetails(expertId: string): Promise<Expert | null> {
    const { data } = await supabase
      .from('experts')
      .select(`
        *,
        users!inner (*)
      `)
      .eq('user_id', expertId)
      .single()
    return data
  },

  async verifyExpert(
    expertId: string,
    verified: boolean,
    notes: string
  ): Promise<void> {
    await supabase
      .from('experts')
      .update({
        verified,
        admin_notes: notes,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', expertId)
  },

  async updateBookingStatus(
    bookingId: string,
    status: BookingStatus
  ): Promise<void> {
    await supabase
      .from('bookings')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId)
  },

  async getTransactions({ status, dateRange, search }: {
    status?: string
    dateRange?: string
    search?: string
  } = {}) {
    let query = supabase
      .from('transactions')
      .select(`
        *,
        client:users!client_id(
          full_name,
          email
        ),
        expert:experts(
          users(
            full_name,
            email
          )
        ),
        booking:bookings(*)
      `)
      .order('created_at', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (dateRange) {
      const now = new Date()
      let startDate = new Date()
      
      switch (dateRange) {
        case '24h':
          startDate.setHours(now.getHours() - 24)
          break
        case '7d':
          startDate.setDate(now.getDate() - 7)
          break
        case '30d':
          startDate.setDate(now.getDate() - 30)
          break
        case '90d':
          startDate.setDate(now.getDate() - 90)
          break
      }

      query = query.gte('created_at', startDate.toISOString())
    }

    if (search) {
      query = query.or(`
        client.full_name.ilike.%${search}%,
        expert.users.full_name.ilike.%${search}%,
        id.ilike.%${search}%
      `)
    }

    const { data } = await query
    return data || []
  },

  async getTransactionStats(timeRange: string) {
    const { data } = await supabase.rpc('get_transaction_stats', {
      time_range: timeRange,
    })

    if (!data) return null

    // Calculate success rate
    const successRate = data.total_count > 0
      ? (data.successful_count / data.total_count) * 100
      : 0

    return {
      totalAmount: data.total_amount,
      totalCount: data.total_count,
      successRate,
      dailyVolume: data.daily_volume,
    }
  },

  async processTransaction(transactionId: string, action: 'refund' | 'void' | 'capture') {
    const { data: transaction } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single()

    if (!transaction) {
      throw new Error('Transaction not found')
    }

    switch (action) {
      case 'refund':
        // Process refund through payment provider
        // Update transaction status
        await supabase
          .from('transactions')
          .update({
            status: 'refunded',
            updated_at: new Date().toISOString(),
          })
          .eq('id', transactionId)
        break

      case 'void':
        // Void the transaction through payment provider
        // Update transaction status
        await supabase
          .from('transactions')
          .update({
            status: 'voided',
            updated_at: new Date().toISOString(),
          })
          .eq('id', transactionId)
        break

      case 'capture':
        // Capture the authorized payment
        // Update transaction status
        await supabase
          .from('transactions')
          .update({
            status: 'succeeded',
            updated_at: new Date().toISOString(),
          })
          .eq('id', transactionId)
        break
    }
  },
}
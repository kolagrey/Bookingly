import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { type Review, type ReviewRating } from '@/types/database'

const supabase = createClientComponentClient()

export const reviewService = {
  async getExpertReviews(expertId: string) {
    const { data } = await supabase
      .from('reviews')
      .select(`
        *,
        ratings:review_ratings(
          category_id,
          rating
        ),
        client:users!client_id(
          full_name,
          avatar_url
        )
      `)
      .eq('expert_id', expertId)
      .eq('moderation_status', 'approved')
      .order('created_at', { ascending: false })
    return data || []
  },

  async createReview(
    review: Omit<Review, 'id' | 'created_at' | 'verified'>,
    ratings: Omit<ReviewRating, 'review_id'>[]
  ) {
    const { data: reviewData, error: reviewError } = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single()

    if (reviewError || !reviewData) {
      return { error: reviewError }
    }

    const { error: ratingsError } = await supabase
      .from('review_ratings')
      .insert(
        ratings.map(rating => ({
          review_id: reviewData.id,
          category_id: rating.category_id,
          rating: rating.rating,
        }))
      )

    return { data: reviewData, error: ratingsError }
  },

  async moderateReview(
    reviewId: string,
    status: 'approved' | 'rejected',
    notes?: string
  ) {
    const { data, error } = await supabase
      .from('reviews')
      .update({
        moderation_status: status,
        moderation_notes: notes,
        moderated_at: new Date().toISOString(),
        moderated_by: supabase.auth.getUser().then(res => res.data.user?.id),
      })
      .eq('id', reviewId)
      .select()
      .single()
    return { data, error }
  },

  async getReviewCategories() {
    const { data } = await supabase
      .from('review_categories')
      .select('*')
      .order('name')
    return data || []
  },
}
export type UserRole = 'client' | 'expert' | 'admin'

export interface BookingTimeStartEndTime {
  start_time: string;
  end_time: string;
}

export interface BookingTimeStartEnd {
  start: string;
  end: string;
}

export type BookingTime = BookingTimeStartEndTime | BookingTimeStartEnd;

export interface User {
  id: string
  email: string
  role: UserRole
  full_name: string
  avatar_url?: string
  timezone: string
  location: string
  preferred_currency: string
  created_at: string
}

export interface Expert extends User {
  expertise: ExpertExpertise[]
  hourly_rate: number
  bio: string
  availability?: AvailabilitySchedule
  verified?: boolean
  rating?: number
  total_reviews?: number
  buffer_time?: number
  portfolio_url: string
  linkedin_url: string
  twitter_handle: string
  instagram_handle: string
}

export interface ExpertExpertise {
  category_id: string
  years_experience: number
  category?: ExpertiseCategory
}

export interface ExpertiseCategory {
  id: string
  name: string
  description?: string
}

export interface PortfolioItem {
  id: string
  expert_id: string
  title: string
  description: string
  image_url?: string
  link_url?: string
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  booking_id: string
  expert_id: string
  client_id: string
  rating: number
  comment: string
  verified: boolean
  moderation_status: 'pending' | 'approved' | 'rejected'
  moderation_notes?: string
  moderated_at?: string
  moderated_by?: string
  created_at: string
}

export interface ReviewCategory {
  id: string
  name: string
  description?: string
}

export interface ReviewRating {
  review_id: string
  category_id: string
  rating: number
}

export interface AvailabilitySchedule {
  weekday: WeekdaySchedule[]
  exceptions: DateException[]
}

export interface WeekdaySchedule {
  day: number // 0-6 (Sunday-Saturday)
  slots: TimeSlot[]
}

export interface DateException {
  date: string
  available: boolean
  slots?: TimeSlot[]
}

export interface TimeSlot {
  start: string // HH:mm
  end: string // HH:mm
}

export interface Booking {
  id: string
  expert_id: string
  client_id: string
  start_time: string
  end_time: string
  status?: BookingStatus
  payment_status?: PaymentStatus
  amount: number
  currency: string
  created_at: string
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed'
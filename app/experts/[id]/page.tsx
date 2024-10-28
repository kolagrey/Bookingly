'use client'

import { useQuery } from '@tanstack/react-query'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/reviews/star-rating'
import { ReviewList } from '@/components/reviews/review-list'
import { PortfolioGrid } from '@/components/portfolio/portfolio-grid'
import { AvailabilityPicker } from '@/components/booking/availability-picker'
import { expertService } from '@/lib/api/expert-service'
import { reviewService } from '@/lib/api/review-service'
import { portfolioService } from '@/lib/api/portfolio-service'
import { formatPrice } from '@/lib/utils'

interface ExpertProfilePageProps {
  params: {
    id: string
  }
}

export default function ExpertProfilePage({ params }: ExpertProfilePageProps) {
  const { data: expert } = useQuery({
    queryKey: ['expert', params.id],
    queryFn: () => expertService.getExpertProfile(params.id),
  })

  const { data: reviews } = useQuery({
    queryKey: ['expert-reviews', params.id],
    queryFn: () => reviewService.getExpertReviews(params.id),
  })

  const { data: portfolio } = useQuery({
    queryKey: ['expert-portfolio', params.id],
    queryFn: () => portfolioService.getExpertPortfolio(params.id),
  })

  const { data: categories } = useQuery({
    queryKey: ['review-categories'],
    queryFn: () => reviewService.getReviewCategories(),
  })

  if (!expert) return null

  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={expert.avatar_url} alt={expert.full_name} />
              <AvatarFallback>{expert.full_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{expert.full_name}</h1>
              <div className="flex items-center gap-2">
                <StarRating value={expert.rating} readonly />
                <span className="text-sm text-muted-foreground">
                  ({expert.total_reviews} reviews)
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {expert.expertise.map((item) => (
                  <Badge key={item.category_id} variant="secondary">
                    {item?.category?.name} • {item.years_experience}+ years
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            <p>{expert.bio}</p>
          </div>

          <Tabs defaultValue="portfolio">
            <TabsList>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio" className="mt-6">
              {portfolio && <PortfolioGrid items={portfolio} readonly />}
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              {reviews && categories && (
                <ReviewList reviews={reviews} categories={categories} />
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-2">Book a Session</h2>
            <div className="text-2xl font-bold mb-6">
              {formatPrice(expert.hourly_rate)} <span className="text-base font-normal">/ hour</span>
            </div>
            <AvailabilityPicker
              expertId={expert.id}
              onSlotSelect={(slot) => {
                // TODO: Implement booking flow
                console.log('Selected slot:', slot)
              }}
            />
          </div>

          {expert.verified && (
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center gap-2 text-green-600">
                <Badge variant="secondary" className="bg-green-50">Verified Expert</Badge>
                <span className="text-sm">Identity & credentials verified</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
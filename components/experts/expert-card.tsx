'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { StarRating } from '@/components/reviews/star-rating'
import { QuickAvailability } from './quick-availability'
import { type Expert } from '@/types/database'
import { formatPrice } from '@/lib/utils'

interface ExpertCardProps {
  expert: Expert
}

export function ExpertCard({ expert }: ExpertCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[4/3]">
        <Avatar className="h-full w-full rounded-none">
          <AvatarImage
            src={expert.avatar_url}
            alt={expert.full_name}
            className="object-cover"
          />
          <AvatarFallback className="rounded-none">
            {expert.full_name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>

      <CardContent className="grid gap-2.5 p-4">
        <div className="space-y-1">
          <h3 className="font-semibold leading-none">
            {expert.full_name}
          </h3>
          <div className="flex items-center gap-1">
            <StarRating value={expert.rating} readonly size="sm" />
            <span className="text-sm text-muted-foreground">
              ({expert.total_reviews})
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {expert.expertise.map((item) => (
            <Badge key={item.category_id} variant="secondary">
              {item?.category?.name}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <QuickAvailability expertId={expert.id} />
        </div>

        <div className="text-lg font-semibold">
          {formatPrice(expert.hourly_rate)} / hour
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/experts/${expert.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
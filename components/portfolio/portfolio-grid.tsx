'use client'

import Image from 'next/image'
import { ExternalLink, Pencil, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { type PortfolioItem } from '@/types/database'

interface PortfolioGridProps {
  items: PortfolioItem[]
  onEdit?: (item: PortfolioItem) => void
  onDelete?: (id: string) => void
  readonly?: boolean
}

export function PortfolioGrid({
  items,
  onEdit,
  onDelete,
  readonly = false,
}: PortfolioGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card key={item.id}>
          {item.image_url && (
            <div className="relative aspect-video">
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
          )}
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {item.description}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            {item.link_url && (
              <Button
                variant="ghost"
                size="sm"
                asChild
              >
                <a
                  href={item.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Project
                </a>
              </Button>
            )}
            {!readonly && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit?.(item)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete?.(item.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { portfolioService } from '@/lib/api/portfolio-service'
import { useToast } from '@/components/ui/use-toast'

const portfolioSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  image_url: z.string().url().optional(),
  link_url: z.string().url().optional(),
})

type PortfolioForm = z.infer<typeof portfolioSchema>

interface PortfolioFormProps {
  expertId: string
  onSuccess: () => void
}

export function PortfolioForm({ expertId, onSuccess }: PortfolioFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  
  const form = useForm<PortfolioForm>({
    resolver: zodResolver(portfolioSchema),
  })

  const onSubmit = async (data: PortfolioForm) => {
    try {
      setIsSubmitting(true)
      const { error } = await portfolioService.addPortfolioItem({
        expert_id: expertId,
        ...data,
      })

      if (error) throw error

      toast({
        title: 'Portfolio item added',
        description: 'Your portfolio has been updated successfully.',
      })
      onSuccess()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add portfolio item. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input {...form.register('title')} />
        {form.formState.errors.title && (
          <p className="text-sm text-destructive">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          {...form.register('description')}
          className="h-32"
        />
        {form.formState.errors.description && (
          <p className="text-sm text-destructive">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium">Image URL</label>
        <Input {...form.register('image_url')} />
        {form.formState.errors.image_url && (
          <p className="text-sm text-destructive">
            {form.formState.errors.image_url.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium">Link URL</label>
        <Input {...form.register('link_url')} />
        {form.formState.errors.link_url && (
          <p className="text-sm text-destructive">
            {form.formState.errors.link_url.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Portfolio Item'}
      </Button>
    </form>
  )
}
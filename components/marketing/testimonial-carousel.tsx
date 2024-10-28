'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const testimonials = [
  {
    content: "The expert guidance I received was invaluable. It helped me pivot my career into tech successfully.",
    author: "Sarah Chen",
    role: "Software Engineer",
    image: "/testimonials/sarah.jpg"
  },
  {
    content: "Outstanding platform for connecting with industry leaders. The booking process was seamless.",
    author: "Michael Rodriguez",
    role: "Product Manager",
    image: "/testimonials/michael.jpg"
  },
  {
    content: "The mentorship I received helped me grow my business exponentially. Highly recommended!",
    author: "Jessica Thompson",
    role: "Startup Founder",
    image: "/testimonials/jessica.jpg"
  }
]

export function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)

  const next = () => {
    setActiveIndex((current) =>
      current === testimonials.length - 1 ? 0 : current + 1
    )
  }

  const previous = () => {
    setActiveIndex((current) =>
      current === 0 ? testimonials.length - 1 : current - 1
    )
  }

  return (
    <section className="py-24 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            What Our Users Say
          </h2>
          <div className="relative mt-16">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={cn(
                  'transition-opacity duration-300 absolute inset-0',
                  index === activeIndex ? 'opacity-100 z-10' : 'opacity-0'
                )}
              >
                <figure>
                  <div className="flex justify-center mb-8">
                    <div className="relative h-20 w-20 rounded-full overflow-hidden">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <blockquote>
                    <p className="text-xl font-medium leading-relaxed">
                      "{testimonial.content}"
                    </p>
                  </blockquote>
                  <figcaption className="mt-6">
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </figcaption>
                </figure>
              </div>
            ))}

            <div className="absolute -left-4 top-1/2 -translate-y-1/2">
              <Button
                variant="ghost"
                size="icon"
                onClick={previous}
                className="rounded-full"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </div>

            <div className="absolute -right-4 top-1/2 -translate-y-1/2">
              <Button
                variant="ghost"
                size="icon"
                onClick={next}
                className="rounded-full"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
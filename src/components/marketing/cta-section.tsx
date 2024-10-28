import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CTASection() {
  return (
    <section className="py-24">
      <div className="container">
        <div className="relative rounded-3xl bg-primary px-6 py-16 sm:px-16 sm:py-24">
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Ready to Accelerate Your Growth?
            </h2>
            <p className="mt-6 text-lg leading-8 text-primary-foreground/80">
              Join thousands of professionals who are already benefiting from
              expert guidance. Start your journey today.
            </p>
            <div className="mt-10 flex justify-center gap-x-6">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="text-lg"
              >
                <Link href="/experts">
                  Browse Experts
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
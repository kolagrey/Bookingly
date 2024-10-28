import { HeroSection } from '@/components/marketing/hero-section'
import { FeatureGrid } from '@/components/marketing/feature-grid'
import { TestimonialCarousel } from '@/components/marketing/testimonial-carousel'
import { ExpertShowcase } from '@/components/marketing/expert-showcase'
import { CTASection } from '@/components/marketing/cta-section'
import { Footer } from '@/components/marketing/footer'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      
      <main>
        <FeatureGrid />
        <ExpertShowcase />
        <TestimonialCarousel />
        <CTASection />
      </main>

      <Footer />
    </>
  )
}
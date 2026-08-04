import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SITE } from '@/config/site'
import { HeroSection } from './HeroSection'
import { FeaturedCollections } from './FeaturedCollections'
import { ServicesPreview } from './ServicesPreview'
import { DesignerStory } from './DesignerStory'
import { TestimonialCarousel } from './TestimonialCarousel'
import { ProcessSteps } from './ProcessSteps'
import { CTASection } from './CTASection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCollections />
      <ServicesPreview />
      <DesignerStory />
      <ProcessSteps />
      <TestimonialCarousel />
      <CTASection />
    </>
  )
}

import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, ArrowRight, Scissors, Crown, Sparkles, PencilRuler, Heart } from 'lucide-react'
import { supabase } from '@/config/supabase'
import { Skeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'

const iconMap: Record<string, typeof Scissors> = {
  'bridal-consultation': Crown,
  'custom-fashion-design': PencilRuler,
  'white-wedding-dresses': Sparkles,
  'liberian-traditional-wedding': Heart,
  'dress-alterations': Scissors,
  'dress-fittings': Clock,
  'evening-wear': Sparkles,
}

const fallbackServices = [
  { id: '1', title: 'Bridal Consultation', slug: 'bridal-consultation', description: 'Personalized consultation to discuss your vision', long_description: 'Sit down with our lead designer for a one-on-one consultation. We\'ll discuss your wedding vision, style preferences, fabric choices, and timeline. This is the first step in creating your perfect dress.', duration_minutes: 60 },
  { id: '2', title: 'Custom Fashion Design', slug: 'custom-fashion-design', description: 'Bespoke design created exclusively for you', long_description: 'From concept to creation, our atelier crafts one-of-a-kind pieces tailored to your exact measurements and style. Each garment is a unique expression of your personality.', duration_minutes: 90 },
  { id: '3', title: 'White Wedding Dresses', slug: 'white-wedding-dresses', description: 'Timeless white wedding gowns', long_description: 'Explore our collection of exquisite white wedding dresses. From classic A-line silhouettes to modern mermaid cuts, each gown is crafted with premium fabrics and meticulous attention to detail.', duration_minutes: 60 },
  { id: '4', title: 'Liberian Traditional Wedding Attire', slug: 'liberian-traditional-wedding', description: 'Authentic Liberian traditional wedding garments', long_description: 'Celebrate your heritage with our authentic Liberian traditional wedding attire. We combine traditional patterns and modern tailoring for a look that honors culture and style.', duration_minutes: 90 },
  { id: '5', title: 'Dress Alterations', slug: 'dress-alterations', description: 'Expert alterations for the perfect fit', long_description: 'Whether it\'s your wedding dress or a favorite gown, our skilled tailors provide precise alterations to ensure a flawless fit. We handle everything from hemming to restructuring.', duration_minutes: 45 },
  { id: '6', title: 'Dress Fittings', slug: 'dress-fittings', description: 'Professional fitting sessions', long_description: 'Schedule a fitting session with our expert fitters. We ensure every seam, hem, and detail sits perfectly on your body for your special day.', duration_minutes: 30 },
  { id: '7', title: 'Evening Wear', slug: 'evening-wear', description: 'Elegant evening gowns and formal wear', long_description: 'Make a statement at your next gala or event with our custom evening wear. From sleek cocktail dresses to sweeping ball gowns, we create pieces that turn heads.', duration_minutes: 60 },
]

export default function ServicesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['services', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
      if (error) throw error
      return data.length > 0 ? data : fallbackServices
    },
    staleTime: 1000 * 60 * 5,
  })

  const services = data ?? fallbackServices

  return (
    <>
      <section className="pt-32 pb-12 bg-gradient-hero">
        <div className="container-luxury text-center">
          <p className="eyebrow text-champagne-700 mb-4">What We Do</p>
          <h1 className="font-display text-display-1 text-charcoal-900">Our Services</h1>
          <p className="mt-4 max-w-2xl mx-auto text-charcoal-500 text-lg">
            From consultation to completion, we offer a full suite of bridal and fashion services.
          </p>
        </div>
      </section>

      <section className="pb-24 bg-ivory-50">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-lg" />)
              : services.map((service, i) => {
                  const Icon = iconMap[service.slug] ?? Sparkles
                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                      className="card-luxury p-8 hover:shadow-card transition-all duration-300"
                    >
                      <div className="flex items-start gap-5">
                        <div className="flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-lg bg-champagne-50 text-champagne-600">
                          <Icon className="h-7 w-7" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-display text-2xl text-charcoal-900 mb-2">{service.title}</h3>
                          <p className="text-charcoal-500 leading-relaxed mb-4">{service.description}</p>
                          {service.duration_minutes && (
                            <p className="text-xs text-charcoal-400 flex items-center gap-1.5 mb-4">
                              <Clock className="h-3.5 w-3.5" />
                              {service.duration_minutes} minutes
                            </p>
                          )}
                          <Link to={`/services/${service.slug}`} className="inline-flex items-center gap-2 text-champagne-600 hover:text-champagne-700 text-sm font-medium link-underline">
                            Learn More
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
          </div>

          <div className="mt-16 text-center p-12 rounded-lg bg-gradient-charcoal text-ivory-100">
            <h2 className="font-display text-display-2 text-ivory-50 mb-4">Ready to Begin?</h2>
            <p className="text-ivory-300 max-w-xl mx-auto mb-8">
              Book an appointment today and take the first step toward your perfect dress.
            </p>
            <Link to="/book-appointment">
              <Button variant="gold" size="lg">Book Appointment</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

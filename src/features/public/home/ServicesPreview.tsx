import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Scissors, Crown, Sparkles, PencilRuler, Clock, Heart } from 'lucide-react'
import { supabase } from '@/config/supabase'
import { Skeleton } from '@/components/ui/Skeleton'

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
  { id: '1', title: 'Bridal Consultation', slug: 'bridal-consultation', description: 'Personalized consultation to discuss your vision', duration_minutes: 60 },
  { id: '2', title: 'Custom Fashion Design', slug: 'custom-fashion-design', description: 'Bespoke design created exclusively for you', duration_minutes: 90 },
  { id: '3', title: 'White Wedding Dresses', slug: 'white-wedding-dresses', description: 'Timeless white wedding gowns', duration_minutes: 60 },
  { id: '4', title: 'Liberian Traditional Wedding Attire', slug: 'liberian-traditional-wedding', description: 'Authentic Liberian traditional wedding garments', duration_minutes: 90 },
  { id: '5', title: 'Dress Alterations', slug: 'dress-alterations', description: 'Expert alterations for the perfect fit', duration_minutes: 45 },
  { id: '6', title: 'Evening Wear', slug: 'evening-wear', description: 'Elegant evening gowns and formal wear', duration_minutes: 60 },
]

export function ServicesPreview() {
  const { data, isLoading } = useQuery({
    queryKey: ['services', 'active'],
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
    <section className="py-24 bg-gradient-ivory">
      <div className="container-luxury">
        <div className="text-center mb-16">
          <p className="eyebrow text-champagne-700 mb-4">What We Offer</p>
          <h2 className="font-display text-display-2 text-charcoal-900">Our Services</h2>
          <p className="mt-4 max-w-2xl mx-auto text-charcoal-500 text-lg">
            From the first consultation to the final fitting, we provide a full range of bridal and fashion services.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-lg" />)
            : services.map((service, i) => {
                const Icon = iconMap[service.slug] ?? Sparkles
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      to={`/services/${service.slug}`}
                      className="group block h-full p-8 card-luxury hover:shadow-card transition-all duration-300"
                    >
                      <div className="flex items-center justify-center h-14 w-14 rounded-lg bg-champagne-50 text-champagne-600 mb-5 group-hover:bg-champagne-100 transition-colors">
                        <Icon className="h-7 w-7" />
                      </div>
                      <h3 className="font-display text-xl text-charcoal-900 group-hover:text-champagne-700 transition-colors">
                        {service.title}
                      </h3>
                      <p className="mt-2 text-charcoal-500 text-sm leading-relaxed">
                        {service.description}
                      </p>
                      {service.duration_minutes && (
                        <p className="mt-4 text-xs text-charcoal-400 flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {service.duration_minutes} minutes
                        </p>
                      )}
                    </Link>
                  </motion.div>
                )
              })}
        </div>
      </div>
    </section>
  )
}

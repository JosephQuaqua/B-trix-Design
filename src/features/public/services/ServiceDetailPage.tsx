import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Calendar } from 'lucide-react'
import { supabase } from '@/config/supabase'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>()

  const { data: service, isLoading } = useQuery({
    queryKey: ['services', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()
      if (error) throw error
      return data
    },
    enabled: !!slug,
  })

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 container-luxury">
        <div className="space-y-4 max-w-2xl">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="pt-32 pb-24 container-luxury">
        <EmptyState
          title="Service Not Found"
          description="The service you're looking for doesn't exist."
          action={<Link to="/services"><Button variant="gold">Back to Services</Button></Link>}
        />
      </div>
    )
  }

  return (
    <section className="pt-32 pb-24 bg-ivory-50">
      <div className="container-luxury max-w-3xl">
        <Link to="/services" className="inline-flex items-center gap-2 text-charcoal-500 hover:text-champagne-600 transition-colors mb-8 text-sm">
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="eyebrow text-champagne-700 mb-4">Service</p>
          <h1 className="font-display text-display-1 text-charcoal-900 mb-4">{service.title}</h1>
          <p className="text-lg text-charcoal-600 leading-relaxed mb-6">{service.description}</p>

          {service.long_description && (
            <div className="prose prose-lg max-w-none">
              <p className="text-charcoal-600 leading-relaxed text-lg">{service.long_description}</p>
            </div>
          )}

          {service.duration_minutes && (
            <div className="mt-8 flex items-center gap-3 p-4 card-luxury">
              <Clock className="h-5 w-5 text-champagne-600" />
              <span className="text-charcoal-700">
                Typical session: <strong>{service.duration_minutes} minutes</strong>
              </span>
            </div>
          )}

          <div className="mt-10">
            <Link to="/book-appointment">
              <Button variant="gold" size="lg">
                <Calendar className="h-5 w-5" />
                Book This Service
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { supabase } from '@/config/supabase'
import { Skeleton } from '@/components/ui/Skeleton'

const fallbackTestimonials = [
  { id: '1', name: 'Sarah M.', rating: 5, comment: 'B\'trix Design created the wedding dress of my dreams. The attention to detail and craftsmanship was beyond anything I imagined. I felt like royalty on my special day.' },
  { id: '2', name: 'Grace K.', rating: 5, comment: 'The Liberian traditional attire they created for my wedding was absolutely stunning. They honored our culture while adding modern elegance. Truly exceptional work.' },
  { id: '3', name: 'Emily T.', rating: 5, comment: 'From the first consultation to the final fitting, the experience was flawless. The team made me feel heard and valued. My custom gown was perfection.' },
  { id: '4', name: 'Mariama B.', rating: 5, comment: 'They altered my mother\'s wedding dress to fit me perfectly for my wedding. It was emotional and the craftsmanship was incredible. Thank you B\'trix!' },
  { id: '5', name: 'Jennifer L.', rating: 5, comment: 'The evening gown they designed for my gala was show-stopping. The fit, the fabric, the finish — everything was impeccable. I felt absolutely stunning.' },
  { id: '6', name: 'Ruth P.', rating: 5, comment: 'I had my bridal party dresses made here and they were gorgeous. The bridesmaids loved them and the coordination was perfect. Highly recommend!' },
]

export default function TestimonialsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['reviews', 'all-published'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data.length > 0 ? data : fallbackTestimonials
    },
    staleTime: 1000 * 60 * 5,
  })

  const testimonials = data ?? fallbackTestimonials

  return (
    <>
      <section className="pt-32 pb-12 bg-gradient-hero">
        <div className="container-luxury text-center">
          <p className="eyebrow text-champagne-700 mb-4">Kind Words</p>
          <h1 className="font-display text-display-1 text-charcoal-900">Testimonials</h1>
          <p className="mt-4 max-w-2xl mx-auto text-charcoal-500 text-lg">
            Stories from brides and clients who trusted us with their special moments.
          </p>
        </div>
      </section>

      <section className="pb-24 bg-ivory-50">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-lg" />)
              : testimonials.map((review, i) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="card-luxury p-8 flex flex-col"
                  >
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`h-4 w-4 ${idx < review.rating ? 'fill-champagne-400 text-champagne-400' : 'text-charcoal-200'}`}
                        />
                      ))}
                    </div>
                    <p className="text-charcoal-600 leading-relaxed italic flex-1">"{review.comment}"</p>
                    <p className="mt-6 text-sm uppercase tracking-widest text-champagne-600 font-medium">{review.name}</p>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>
    </>
  )
}

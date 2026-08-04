import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { supabase } from '@/config/supabase'
import { Skeleton } from '@/components/ui/Skeleton'

const fallbackTestimonials = [
  {
    id: '1', name: 'Sarah M.', rating: 5,
    comment: 'B\'trix Design created the wedding dress of my dreams. The attention to detail and craftsmanship was beyond anything I imagined. I felt like royalty on my special day.',
  },
  {
    id: '2', name: 'Grace K.', rating: 5,
    comment: 'The Liberian traditional attire they created for my wedding was absolutely stunning. They honored our culture while adding modern elegance. Truly exceptional work.',
  },
  {
    id: '3', name: 'Emily T.', rating: 5,
    comment: 'From the first consultation to the final fitting, the experience was flawless. The team made me feel heard and valued. My custom gown was perfection.',
  },
]

export function TestimonialCarousel() {
  const [current, setCurrent] = useState(0)
  const { data, isLoading } = useQuery({
    queryKey: ['reviews', 'published'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(10)
      if (error) throw error
      return data.length > 0 ? data : fallbackTestimonials
    },
    staleTime: 1000 * 60 * 5,
  })

  const testimonials = data ?? fallbackTestimonials

  useEffect(() => {
    if (testimonials.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  return (
    <section className="py-24 bg-gradient-ivory">
      <div className="container-luxury">
        <div className="text-center mb-12">
          <p className="eyebrow text-champagne-700 mb-4">Kind Words</p>
          <h2 className="font-display text-display-2 text-charcoal-900">Client Stories</h2>
        </div>

        <div className="relative max-w-3xl mx-auto">
          {isLoading ? (
            <Skeleton className="h-48 rounded-lg" />
          ) : (
            <>
              <Quote className="absolute -top-4 left-1/2 -translate-x-1/2 h-12 w-12 text-champagne-200" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center pt-8"
                >
                  <div className="flex justify-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < (testimonials[current].rating ?? 5) ? 'fill-champagne-400 text-champagne-400' : 'text-charcoal-200'}`}
                      />
                    ))}
                  </div>
                  <p className="font-display text-2xl text-charcoal-800 leading-relaxed italic">
                    "{testimonials[current].comment}"
                  </p>
                  <p className="mt-6 text-sm uppercase tracking-widest text-champagne-600">
                    {testimonials[current].name}
                  </p>
                </motion.div>
              </AnimatePresence>

              {testimonials.length > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-champagne-500' : 'w-2 bg-charcoal-200'}`}
                      aria-label={`Testimonial ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}

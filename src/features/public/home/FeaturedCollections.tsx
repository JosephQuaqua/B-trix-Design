import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { supabase } from '@/config/supabase'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { COLLECTION_CATEGORIES } from '@/lib/constants'

const fallbackCollections = [
  {
    id: '1', title: 'Eternal Ivory', slug: 'eternal-ivory',
    description: 'A timeless A-line gown with delicate lace detailing and a cathedral-length train.',
    category: 'white_wedding', fabric: 'French Lace & Silk Satin', color: 'Ivory White',
    image_url: 'https://images.pexels.com/photos/28863326/pexels-photo-28863326.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '2', title: 'Monrovia Heritage', slug: 'monrovia-heritage',
    description: 'Authentic Liberian traditional wedding attire with hand-wrapped country cloth and gold accents.',
    category: 'liberian_traditional', fabric: 'Country Cloth & Kente', color: 'Gold & Burgundy',
    image_url: 'https://images.pexels.com/photos/30297186/pexels-photo-30297186.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '3', title: 'Golden Hour', slug: 'golden-hour',
    description: 'An evening gown that captures the warmth of sunset in champagne gold sequins.',
    category: 'evening_wear', fabric: 'Sequined Chiffon', color: 'Champagne Gold',
    image_url: 'https://images.pexels.com/photos/16700331/pexels-photo-16700331.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
]

export function FeaturedCollections() {
  const { data, isLoading } = useQuery({
    queryKey: ['collections', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('is_featured', true)
        .order('sort_order')
        .limit(3)
      if (error) throw error
      return data.length > 0 ? data : fallbackCollections
    },
    staleTime: 1000 * 60 * 5,
  })

  const collections = data ?? fallbackCollections

  return (
    <section className="py-24 bg-ivory-50">
      <div className="container-luxury">
        <div className="text-center mb-16">
          <p className="eyebrow text-champagne-700 mb-4">Our Collections</p>
          <h2 className="font-display text-display-2 text-charcoal-900">Crafted with Intention</h2>
          <p className="mt-4 max-w-2xl mx-auto text-charcoal-500 text-lg">
            Each piece in our atelier is a celebration of heritage, artistry, and the individual story of every bride.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))
            : collections.map((collection, i) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link to={`/collections/${collection.slug}`} className="group block">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-ivory-200">
                      <img
                        src={collection.image_url ?? ''}
                        alt={collection.title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="text-ivory-50 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          View Collection
                        </span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs uppercase tracking-widest text-champagne-600 mb-1">
                        {COLLECTION_CATEGORIES.find((c) => c.value === collection.category)?.label ?? collection.category}
                      </p>
                      <h3 className="font-display text-2xl text-charcoal-900 group-hover:text-champagne-700 transition-colors">
                        {collection.title}
                      </h3>
                      <p className="mt-2 text-charcoal-500 text-sm leading-relaxed line-clamp-2">
                        {collection.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/collections">
            <Button variant="outline" className="group">
              View All Collections
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '@/config/supabase'
import { Skeleton } from '@/components/ui/Skeleton'
import { COLLECTION_CATEGORIES, type CollectionCategory } from '@/lib/constants'

const fallbackCollections = [
  { id: '1', title: 'Eternal Ivory', slug: 'eternal-ivory', description: 'A timeless A-line gown with delicate lace detailing.', category: 'white_wedding', fabric: 'French Lace & Silk Satin', color: 'Ivory White', image_url: 'https://images.pexels.com/photos/28863326/pexels-photo-28863326.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: '2', title: 'Monrovia Heritage', slug: 'monrovia-heritage', description: 'Authentic Liberian traditional wedding attire.', category: 'liberian_traditional', fabric: 'Country Cloth & Kente', color: 'Gold & Burgundy', image_url: 'https://images.pexels.com/photos/30297186/pexels-photo-30297186.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: '3', title: 'Celestial Silk', slug: 'celestial-silk', description: 'A modern mermaid silhouette in pure silk.', category: 'white_wedding', fabric: 'Pure Silk Mikado', color: 'Diamond White', image_url: 'https://images.pexels.com/photos/29495750/pexels-photo-29495750.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: '4', title: 'Golden Hour', slug: 'golden-hour', description: 'An evening gown in champagne gold sequins.', category: 'evening_wear', fabric: 'Sequined Chiffon', color: 'Champagne Gold', image_url: 'https://images.pexels.com/photos/16700331/pexels-photo-16700331.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: '5', title: 'Bridal Party Blossoms', slug: 'bridal-party-blossoms', description: 'Coordinated bridesmaid dresses in soft blush tones.', category: 'bridal_party', fabric: 'Chiffon & Crepe', color: 'Blush Pink', image_url: 'https://images.pexels.com/photos/15234465/pexels-photo-15234465.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: '6', title: 'Atelier Custom', slug: 'atelier-custom', description: 'A bespoke creation showcasing finest craftsmanship.', category: 'custom_fashion', fabric: 'Hand-Selected Fabrics', color: 'Custom', image_url: 'https://images.pexels.com/photos/28863322/pexels-photo-28863322.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: '7', title: 'Liberian Grace', slug: 'liberian-grace', description: 'A fusion of Liberian traditional elements with modern bridal silhouettes.', category: 'liberian_traditional', fabric: 'Lappa & Silk', color: 'White & Gold', image_url: 'https://images.pexels.com/photos/36997663/pexels-photo-36997663.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: '8', title: 'Refined Alteration', slug: 'refined-alteration', description: 'Expertly altered heirloom gown given new life.', category: 'alterations', fabric: 'Original Fabric', color: 'Original', image_url: 'https://images.pexels.com/photos/792780/pexels-photo-792780.jpeg?auto=compress&cs=tinysrgb&w=800' },
]

export default function CollectionsPage() {
  const [filter, setFilter] = useState<CollectionCategory | 'all'>('all')

  const { data, isLoading } = useQuery({
    queryKey: ['collections', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('sort_order')
      if (error) throw error
      return data.length > 0 ? data : fallbackCollections
    },
    staleTime: 1000 * 60 * 5,
  })

  const collections = data ?? fallbackCollections
  const filtered = useMemo(() => {
    if (filter === 'all') return collections
    return collections.filter((c) => c.category === filter)
  }, [collections, filter])

  return (
    <>
      <section className="pt-32 pb-12 bg-gradient-hero">
        <div className="container-luxury text-center">
          <p className="eyebrow text-champagne-700 mb-4">Our Work</p>
          <h1 className="font-display text-display-1 text-charcoal-900">Collections</h1>
          <p className="mt-4 max-w-2xl mx-auto text-charcoal-500 text-lg">
            Explore our portfolio of bridal gowns, traditional attire, and custom designs.
          </p>
        </div>
      </section>

      <section className="pb-24 bg-ivory-50">
        <div className="container-luxury">
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => setFilter('all')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${filter === 'all' ? 'bg-charcoal-900 text-ivory-50' : 'bg-ivory-100 text-charcoal-600 hover:bg-ivory-200'}`}
            >
              All
            </button>
            {COLLECTION_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${filter === cat.value ? 'bg-charcoal-900 text-ivory-50' : 'bg-ivory-100 text-charcoal-600 hover:bg-ivory-200'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4] rounded-lg" />)
              : filtered.map((collection, i) => (
                  <motion.div
                    key={collection.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                  >
                    <Link to={`/collections/${collection.slug}`} className="group block">
                      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-ivory-200">
                        <img
                          src={collection.image_url ?? ''}
                          alt={collection.title}
                          className="h-full w-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                      <div className="mt-4">
                        <p className="text-xs uppercase tracking-widest text-champagne-600 mb-1">
                          {COLLECTION_CATEGORIES.find((c) => c.value === collection.category)?.label}
                        </p>
                        <h3 className="font-display text-xl text-charcoal-900 group-hover:text-champagne-700 transition-colors">
                          {collection.title}
                        </h3>
                        <p className="mt-1 text-sm text-charcoal-500 line-clamp-2">{collection.description}</p>
                        {collection.fabric && (
                          <p className="mt-2 text-xs text-charcoal-400">{collection.fabric}</p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>
    </>
  )
}

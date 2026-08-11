import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Heart } from 'lucide-react'
import { supabase } from '@/config/supabase'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { COLLECTION_CATEGORIES } from '@/lib/constants'

export default function CollectionDetailPage() {
  const { slug } = useParams<{ slug: string }>()

  const { data: collection, isLoading } = useQuery({
    queryKey: ['collections', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()
      if (error) throw error
      return data
    },
    enabled: !!slug,
  })

  const { data: gallery } = useQuery({
  queryKey: ['gallery', collection?.id],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .eq('collection_id', collection!.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },
  enabled: !!collection,
})


  if (isLoading) {
    return (
      <div className="pt-32 pb-24 container-luxury">
        <div className="grid lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-[3/4] rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!collection) {
    return (
      <div className="pt-32 pb-24 container-luxury">
        <EmptyState
          title="Collection Not Found"
          description="The collection you're looking for doesn't exist or has been removed."
          action={<Link to="/collections"><Button variant="gold">Back to Collections</Button></Link>}
        />
      </div>
    )
  }

  return (
    <>
      <section className="pt-32 pb-16 bg-ivory-50">
        <div className="container-luxury">
          <Link to="/collections" className="inline-flex items-center gap-2 text-charcoal-500 hover:text-champagne-600 transition-colors mb-8 text-sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Collections
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[3/4] rounded-lg overflow-hidden bg-ivory-200"
            >
              <img
                src={collection.image_url ?? ''}
                alt={collection.title}
                className="h-full w-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p className="eyebrow text-champagne-700 mb-3">
                {COLLECTION_CATEGORIES.find((c) => c.value === collection.category)?.label}
              </p>
              <h1 className="font-display text-display-2 text-charcoal-900 mb-4">{collection.title}</h1>
              <p className="text-charcoal-600 leading-relaxed text-lg mb-6">{collection.description}</p>

              <div className="space-y-3 py-6 border-y border-ivory-200">
                {collection.fabric && (
                  <div className="flex justify-between">
                    <span className="text-charcoal-400 text-sm uppercase tracking-wider">Fabric</span>
                    <span className="text-charcoal-800 text-sm font-medium">{collection.fabric}</span>
                  </div>
                )}
                {collection.color && (
                  <div className="flex justify-between">
                    <span className="text-charcoal-400 text-sm uppercase tracking-wider">Color</span>
                    <span className="text-charcoal-800 text-sm font-medium">{collection.color}</span>
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/book-appointment">
                  <Button variant="gold" size="lg" className="w-full sm:w-auto">
                    <Calendar className="h-5 w-5" />
                    Book a Consultation
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Heart className="h-5 w-5" />
                  Add to Favorites
                </Button>
              </div>
            </motion.div>
          </div>
              </div>
    </section>

    {gallery && gallery.length > 0 && (
      <section className="pb-24 bg-ivory-50">
        <div className="container-luxury">
          <h2 className="font-display text-display-2 text-charcoal-900 mb-8 text-center">
            Collection Gallery
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="aspect-[3/4] overflow-hidden rounded-lg bg-ivory-200"
              >
                <img
                  src={item.image_url ?? ''}
                  alt={item.title ?? collection.title}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    )}

    

        </>
  )
}

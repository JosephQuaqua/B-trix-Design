import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { supabase } from '@/config/supabase'
import { useAuth } from '@/context/AuthContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'

export default function FavoritesPage() {
  const { profile } = useAuth()

  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites', 'customer'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select('*, collection:collections(*)')
        .eq('customer_id', profile!.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!profile,
  })

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="eyebrow text-champagne-700 mb-2">Dashboard</p>
        <h1 className="font-display text-display-2 text-charcoal-900 mb-8">My Favorites</h1>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4] rounded-lg" />)}
        </div>
      ) : favorites && favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav, i) => (
            <motion.div
              key={fav.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link to={`/collections/${fav.collection?.slug}`}>
                <Card className="overflow-hidden p-0 hover:shadow-card transition-all">
                  <div className="aspect-[3/4] overflow-hidden bg-ivory-200">
                    <img
                      src={fav.collection?.image_url ?? ''}
                      alt={fav.collection?.title ?? ''}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg text-charcoal-900">{fav.collection?.title}</h3>
                    <p className="text-sm text-charcoal-500 mt-1 line-clamp-2">{fav.collection?.description}</p>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Favorites Yet"
          description="Browse our collections and save the designs you love."
          icon={<Heart className="h-12 w-12" />}
          action={<Link to="/collections"><Button variant="gold">Browse Collections</Button></Link>}
        />
      )}
    </div>
  )
}

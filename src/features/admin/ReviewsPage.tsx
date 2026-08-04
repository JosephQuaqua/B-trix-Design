import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Star, Check, X } from 'lucide-react'
import { supabase } from '@/config/supabase'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatDate } from '@/lib/format'

export default function ReviewsPage() {
  const queryClient = useQueryClient()

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['admin', 'reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })

  const togglePublish = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase.from('reviews').update({ is_published: published }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] }),
  })

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="eyebrow text-champagne-700 mb-2">Admin Panel</p>
        <h1 className="font-display text-display-2 text-charcoal-900 mb-8">Reviews</h1>
      </motion.div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-lg" />)}
        </div>
      ) : reviews && reviews.length > 0 ? (
        <div className="space-y-3">
          {reviews.map((review) => (
            <Card key={review.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-medium text-charcoal-900">{review.name}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-champagne-400 text-champagne-400' : 'text-charcoal-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-charcoal-600 text-sm leading-relaxed italic">"{review.comment}"</p>
                  <p className="text-xs text-charcoal-400 mt-2">{formatDate(review.created_at)}</p>
                </div>
                <div className="flex flex-col gap-2">
                  {review.is_published ? (
                    <Button size="sm" variant="outline" onClick={() => togglePublish.mutate({ id: review.id, published: false })}>
                      <X className="h-4 w-4" />
                      Unpublish
                    </Button>
                  ) : (
                    <Button size="sm" variant="gold" onClick={() => togglePublish.mutate({ id: review.id, published: true })}>
                      <Check className="h-4 w-4" />
                      Publish
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No Reviews" description="Customer reviews will appear here." icon={<Star className="h-12 w-12" />} />
      )}
    </div>
  )
}

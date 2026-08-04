import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { CalendarDays, Users, Star, TrendingUp } from 'lucide-react'
import { supabase } from '@/config/supabase'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'

export default function ReportsPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'reports'],
    queryFn: async () => {
      const [pending, approved, completed, cancelled, customers, reviews] = await Promise.all([
        supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
        supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'cancelled'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
        supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('is_published', true),
      ])
      return {
        pending: pending.count ?? 0,
        approved: approved.count ?? 0,
        completed: completed.count ?? 0,
        cancelled: cancelled.count ?? 0,
        customers: customers.count ?? 0,
        reviews: reviews.count ?? 0,
      }
    },
  })

  const cards = [
    { label: 'Pending Appointments', value: stats?.pending ?? 0, icon: CalendarDays },
    { label: 'Approved Appointments', value: stats?.approved ?? 0, icon: TrendingUp },
    { label: 'Completed', value: stats?.completed ?? 0, icon: Star },
    { label: 'Cancelled', value: stats?.cancelled ?? 0, icon: Users },
  ]

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="eyebrow text-champagne-700 mb-2">Admin Panel</p>
        <h1 className="font-display text-display-2 text-charcoal-900 mb-8">Reports</h1>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cards.map((card, i) => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }}>
              <Card>
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-champagne-50 text-champagne-600">
                    <card.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-display text-charcoal-900">{card.value}</p>
                    <p className="text-sm text-charcoal-500">{card.label}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Card>
        <h3 className="font-display text-lg text-charcoal-900 mb-4">Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-ivory-200">
            <span className="text-charcoal-500">Total Customers</span>
            <span className="font-medium text-charcoal-900">{stats?.customers ?? 0}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-ivory-200">
            <span className="text-charcoal-500">Published Reviews</span>
            <span className="font-medium text-charcoal-900">{stats?.reviews ?? 0}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-charcoal-500">Total Appointments</span>
            <span className="font-medium text-charcoal-900">
              {(stats?.pending ?? 0) + (stats?.approved ?? 0) + (stats?.completed ?? 0) + (stats?.cancelled ?? 0)}
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}

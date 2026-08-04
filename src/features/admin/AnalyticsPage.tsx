import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Activity, TrendingUp, Users, Calendar } from 'lucide-react'
import { supabase } from '@/config/supabase'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: async () => {
      const [total, pending, approved, completed, customers] = await Promise.all([
        supabase.from('appointments').select('*', { count: 'exact', head: true }),
        supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
      ])
      return {
        total: total.count ?? 0,
        pending: pending.count ?? 0,
        approved: approved.count ?? 0,
        completed: completed.count ?? 0,
        customers: customers.count ?? 0,
      }
    },
  })

  const cards = [
    { label: 'Total Appointments', value: data?.total ?? 0, icon: Calendar },
    { label: 'Total Customers', value: data?.customers ?? 0, icon: Users },
    { label: 'Approval Rate', value: data && data.total > 0 ? `${Math.round(((data.approved + data.completed) / data.total) * 100)}%` : '—', icon: TrendingUp },
    { label: 'Completion Rate', value: data && data.total > 0 ? `${Math.round((data.completed / data.total) * 100)}%` : '—', icon: Activity },
  ]

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="eyebrow text-champagne-700 mb-2">Super Admin</p>
        <h1 className="font-display text-display-2 text-charcoal-900 mb-8">Analytics</h1>
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
        <h3 className="font-display text-lg text-charcoal-900 mb-4">Appointment Distribution</h3>
        <div className="space-y-4">
          {[
            { label: 'Pending', value: data?.pending ?? 0, color: 'bg-warning-500' },
            { label: 'Approved', value: data?.approved ?? 0, color: 'bg-success-500' },
            { label: 'Completed', value: data?.completed ?? 0, color: 'bg-info-500' },
          ].map((item) => {
            const total = data?.total ?? 1
            const pct = Math.round((item.value / total) * 100)
            return (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-charcoal-600">{item.label}</span>
                  <span className="text-charcoal-400">{item.value} ({pct}%)</span>
                </div>
                <div className="h-2 rounded-full bg-ivory-200 overflow-hidden">
                  <div className={`h-full ${item.color} transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

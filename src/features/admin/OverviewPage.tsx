import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { CalendarDays, Users, Star, FolderOpen } from 'lucide-react'
import { supabase } from '@/config/supabase'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_COLORS } from '@/lib/constants'
import { formatDate } from '@/lib/format'

export default function OverviewPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const [appointments, customers, reviews, collections] = await Promise.all([
        supabase.from('appointments').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
        supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('collections').select('*', { count: 'exact', head: true }),
      ])
      return {
        appointments: appointments.count ?? 0,
        customers: customers.count ?? 0,
        reviews: reviews.count ?? 0,
        collections: collections.count ?? 0,
      }
    },
  })

  const { data: recentAppointments } = useQuery({
    queryKey: ['admin', 'recent-appointments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, service:services(title), customer:profiles(full_name, email)')
        .order('created_at', { ascending: false })
        .limit(5)
      if (error) throw error
      return data
    },
  })

  const statCards = [
    { label: 'Appointments', value: stats?.appointments ?? 0, icon: CalendarDays },
    { label: 'Customers', value: stats?.customers ?? 0, icon: Users },
    { label: 'Reviews', value: stats?.reviews ?? 0, icon: Star },
    { label: 'Collections', value: stats?.collections ?? 0, icon: FolderOpen },
  ]

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="eyebrow text-champagne-700 mb-2">Admin Panel</p>
        <h1 className="font-display text-display-2 text-charcoal-900 mb-8">Overview</h1>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)
          : statCards.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                <Card>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-champagne-50 text-champagne-600">
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-display text-charcoal-900">{stat.value}</p>
                      <p className="text-sm text-charcoal-500">{stat.label}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
      </div>

      <h2 className="font-display text-2xl text-charcoal-900 mb-4">Recent Appointments</h2>
      {recentAppointments && recentAppointments.length > 0 ? (
        <div className="space-y-3">
          {recentAppointments.map((apt) => (
            <Card key={apt.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-charcoal-900">{apt.service?.title ?? 'Service'}</p>
                <p className="text-sm text-charcoal-500">
                  {apt.customer?.full_name ?? apt.customer?.email ?? 'Customer'} · {formatDate(apt.preferred_date)} at {apt.preferred_time}
                </p>
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full border ${APPOINTMENT_STATUS_COLORS[apt.status as keyof typeof APPOINTMENT_STATUS_COLORS] ?? ''}`}>
                {APPOINTMENT_STATUS_LABELS[apt.status as keyof typeof APPOINTMENT_STATUS_LABELS] ?? apt.status}
              </span>
            </Card>
          ))}
        </div>
      ) : (
        <Card><p className="text-charcoal-500 text-center py-8">No appointments yet.</p></Card>
      )}
    </div>
  )
}

import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarDays, Heart, Ruler, MessageSquare, Clock } from 'lucide-react'
import { supabase } from '@/config/supabase'
import { useAuth } from '@/context/AuthContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_COLORS } from '@/lib/constants'
import { formatDate } from '@/lib/format'

export default function OverviewPage() {
  const { profile } = useAuth()

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments', 'customer'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, service:services(title)')
        .eq('customer_id', profile!.id)
        .order('created_at', { ascending: false })
        .limit(5)
      if (error) throw error
      return data
    },
    enabled: !!profile,
  })

  const { data: favoritesCount } = useQuery({
    queryKey: ['favorites', 'count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('customer_id', profile!.id)
      return count ?? 0
    },
    enabled: !!profile,
  })

  const stats = [
    { label: 'Appointments', value: appointments?.length ?? 0, icon: CalendarDays, to: '/dashboard/appointments' },
    { label: 'Favorites', value: favoritesCount ?? 0, icon: Heart, to: '/dashboard/favorites' },
    { label: 'Messages', value: 0, icon: MessageSquare, to: '/dashboard/messages' },
    { label: 'Measurements', value: 0, icon: Ruler, to: '/dashboard/measurements' },
  ]

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="eyebrow text-champagne-700 mb-2">Dashboard</p>
        <h1 className="font-display text-display-2 text-charcoal-900 mb-2">
          Welcome, {profile?.full_name?.split(' ')[0] ?? 'there'}
        </h1>
        <p className="text-charcoal-500 mb-10">Manage your appointments, favorites, and profile.</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Link to={stat.to}>
              <Card className="hover:shadow-card transition-all duration-300 cursor-pointer">
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
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl text-charcoal-900">Recent Appointments</h2>
            <Link to="/dashboard/appointments">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
            </div>
          ) : appointments && appointments.length > 0 ? (
            <div className="space-y-3">
              {appointments.map((apt) => (
                <Card key={apt.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-charcoal-900">{apt.service?.title ?? 'Service'}</p>
                    <p className="text-sm text-charcoal-500 flex items-center gap-1.5 mt-1">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDate(apt.preferred_date)} at {apt.preferred_time}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full border ${APPOINTMENT_STATUS_COLORS[apt.status as keyof typeof APPOINTMENT_STATUS_COLORS] ?? ''}`}>
                    {APPOINTMENT_STATUS_LABELS[apt.status as keyof typeof APPOINTMENT_STATUS_LABELS] ?? apt.status}
                  </span>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <div className="text-center py-8">
                <p className="text-charcoal-500 mb-4">No appointments yet.</p>
                <Link to="/book-appointment">
                  <Button variant="gold" size="sm">Book Your First Appointment</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>

        <div>
          <h2 className="font-display text-2xl text-charcoal-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/book-appointment">
              <Card className="hover:shadow-card transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5 text-champagne-600" />
                  <span className="text-charcoal-800 font-medium">Book Appointment</span>
                </div>
              </Card>
            </Link>
            <Link to="/collections">
              <Card className="hover:shadow-card transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-champagne-600" />
                  <span className="text-charcoal-800 font-medium">Browse Collections</span>
                </div>
              </Card>
            </Link>
            <Link to="/dashboard/measurements">
              <Card className="hover:shadow-card transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <Ruler className="h-5 w-5 text-champagne-600" />
                  <span className="text-charcoal-800 font-medium">Update Measurements</span>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

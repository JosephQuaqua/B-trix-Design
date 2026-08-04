import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarDays, Clock, ChevronRight } from 'lucide-react'
import { supabase } from '@/config/supabase'
import { useAuth } from '@/context/AuthContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_COLORS } from '@/lib/constants'
import { formatDate } from '@/lib/format'

export default function AppointmentsPage() {
  const { profile } = useAuth()

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments', 'customer', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, service:services(title)')
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="eyebrow text-champagne-700 mb-2">Dashboard</p>
            <h1 className="font-display text-display-2 text-charcoal-900">My Appointments</h1>
          </div>
          <Link to="/book-appointment">
            <Button variant="gold" size="sm">Book New</Button>
          </Link>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
        </div>
      ) : appointments && appointments.length > 0 ? (
        <div className="space-y-3">
          {appointments.map((apt, i) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link to={`/dashboard/appointments/${apt.id}`}>
                <Card className="hover:shadow-card transition-all cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-display text-lg text-charcoal-900">{apt.service?.title ?? 'Appointment'}</p>
                      <p className="text-sm text-charcoal-500 flex items-center gap-1.5 mt-1">
                        <CalendarDays className="h-4 w-4" />
                        {formatDate(apt.preferred_date)}
                        <span className="mx-1">·</span>
                        <Clock className="h-4 w-4" />
                        {apt.preferred_time}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full border ${APPOINTMENT_STATUS_COLORS[apt.status as keyof typeof APPOINTMENT_STATUS_COLORS] ?? ''}`}>
                        {APPOINTMENT_STATUS_LABELS[apt.status as keyof typeof APPOINTMENT_STATUS_LABELS] ?? apt.status}
                      </span>
                      <ChevronRight className="h-5 w-5 text-charcoal-300" />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Appointments Yet"
          description="Book your first consultation to get started on your dream dress."
          icon={<CalendarDays className="h-12 w-12" />}
          action={<Link to="/book-appointment"><Button variant="gold">Book Appointment</Button></Link>}
        />
      )}
    </div>
  )
}

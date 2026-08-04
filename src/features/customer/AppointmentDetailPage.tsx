import { useQuery } from '@tanstack/react-query'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, FileText, X } from 'lucide-react'
import { supabase } from '@/config/supabase'
import { useAuth } from '@/context/AuthContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_COLORS } from '@/lib/constants'
import { formatDate } from '@/lib/format'
import { useState } from 'react'

export default function AppointmentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [cancelling, setCancelling] = useState(false)

  const { data: appointment, isLoading } = useQuery({
    queryKey: ['appointments', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, service:services(title, description)')
        .eq('id', id!)
        .maybeSingle()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })

  const handleCancel = async () => {
    setCancelling(true)
    await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', id!)
    setCancelling(false)
    navigate('/dashboard/appointments')
  }

  if (isLoading) {
    return (
      <div className="p-6 lg:p-10 max-w-3xl mx-auto">
        <Skeleton className="h-6 w-24 mb-6" />
        <Skeleton className="h-48 rounded-lg" />
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="p-6 lg:p-10 max-w-3xl mx-auto">
        <EmptyState
          title="Appointment Not Found"
          description="This appointment may have been removed."
          action={<Link to="/dashboard/appointments"><Button variant="gold">Back to Appointments</Button></Link>}
        />
      </div>
    )
  }

  const canCancel = appointment.status === 'pending' || appointment.status === 'approved'

  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto">
      <Link to="/dashboard/appointments" className="inline-flex items-center gap-2 text-charcoal-500 hover:text-champagne-600 transition-colors mb-6 text-sm">
        <ArrowLeft className="h-4 w-4" />
        Back to Appointments
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-display-2 text-charcoal-900">{appointment.service?.title ?? 'Appointment'}</h1>
          <span className={`text-sm font-medium px-4 py-1.5 rounded-full border ${APPOINTMENT_STATUS_COLORS[appointment.status as keyof typeof APPOINTMENT_STATUS_COLORS] ?? ''}`}>
            {APPOINTMENT_STATUS_LABELS[appointment.status as keyof typeof APPOINTMENT_STATUS_LABELS] ?? appointment.status}
          </span>
        </div>

        <Card className="mb-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-champagne-600" />
              <div>
                <p className="text-sm text-charcoal-400">Date</p>
                <p className="text-charcoal-800 font-medium">{formatDate(appointment.preferred_date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-champagne-600" />
              <div>
                <p className="text-sm text-charcoal-400">Time</p>
                <p className="text-charcoal-800 font-medium">{appointment.preferred_time}</p>
              </div>
            </div>
            {appointment.notes && (
              <div className="flex items-start gap-3 pt-2 border-t border-ivory-200">
                <FileText className="h-5 w-5 text-champagne-600 mt-0.5" />
                <div>
                  <p className="text-sm text-charcoal-400">Notes</p>
                  <p className="text-charcoal-800">{appointment.notes}</p>
                </div>
              </div>
            )}
            {appointment.admin_notes && (
              <div className="flex items-start gap-3 pt-2 border-t border-ivory-200">
                <FileText className="h-5 w-5 text-champagne-600 mt-0.5" />
                <div>
                  <p className="text-sm text-charcoal-400">Notes from B'trix Design</p>
                  <p className="text-charcoal-800">{appointment.admin_notes}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {canCancel && (
          <Button variant="outline" loading={cancelling} onClick={handleCancel} className="text-danger-700 border-danger-500/30 hover:border-danger-500">
            <X className="h-4 w-4" />
            Cancel Appointment
          </Button>
        )}
      </motion.div>
    </div>
  )
}

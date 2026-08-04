import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Check, X, Clock } from 'lucide-react'
import { supabase } from '@/config/supabase'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_COLORS } from '@/lib/constants'
import { formatDate } from '@/lib/format'

export default function AppointmentsAdminPage() {
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState<string>('all')

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['admin', 'appointments', filter],
    queryFn: async () => {
      let query = supabase
        .from('appointments')
        .select('*, service:services(title), customer:profiles(full_name, email)')
        .order('created_at', { ascending: false })
      if (filter !== 'all') query = query.eq('status', filter)
      const { data, error } = await query
      if (error) throw error
      return data
    },
  })

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('appointments').update({ status }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'appointments'] }),
  })

  const filters = ['all', 'pending', 'approved', 'rejected', 'cancelled', 'completed']

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="eyebrow text-champagne-700 mb-2">Admin Panel</p>
        <h1 className="font-display text-display-2 text-charcoal-900 mb-8">Appointments</h1>
      </motion.div>

      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f ? 'bg-charcoal-900 text-ivory-50' : 'bg-ivory-100 text-charcoal-600 hover:bg-ivory-200'}`}
          >
            {f === 'all' ? 'All' : APPOINTMENT_STATUS_LABELS[f as keyof typeof APPOINTMENT_STATUS_LABELS] ?? f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
        </div>
      ) : appointments && appointments.length > 0 ? (
        <div className="space-y-3">
          {appointments.map((apt) => (
            <Card key={apt.id}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-charcoal-900">{apt.service?.title ?? 'Service'}</p>
                  <p className="text-sm text-charcoal-500 mt-1">
                    {apt.customer?.full_name ?? apt.customer?.email ?? 'Customer'}
                  </p>
                  <p className="text-sm text-charcoal-400 flex items-center gap-1.5 mt-1">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDate(apt.preferred_date)} at {apt.preferred_time}
                  </p>
                  {apt.notes && <p className="text-sm text-charcoal-500 mt-2 italic">"{apt.notes}"</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full border ${APPOINTMENT_STATUS_COLORS[apt.status as keyof typeof APPOINTMENT_STATUS_COLORS] ?? ''}`}>
                    {APPOINTMENT_STATUS_LABELS[apt.status as keyof typeof APPOINTMENT_STATUS_LABELS] ?? apt.status}
                  </span>
                  {apt.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="gold"
                        loading={updateStatus.isPending}
                        onClick={() => updateStatus.mutate({ id: apt.id, status: 'approved' })}
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        loading={updateStatus.isPending}
                        onClick={() => updateStatus.mutate({ id: apt.id, status: 'rejected' })}
                        className="text-danger-700 border-danger-500/30"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No Appointments" description="There are no appointments matching this filter." />
      )}
    </div>
  )
}

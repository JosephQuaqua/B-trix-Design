import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { UserCog, Mail } from 'lucide-react'
import { supabase } from '@/config/supabase'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatDate } from '@/lib/format'

export default function StaffPage() {
  const { data: staff, isLoading } = useQuery({
    queryKey: ['admin', 'staff'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['staff', 'admin', 'super_admin'])
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="eyebrow text-champagne-700 mb-2">Admin Panel</p>
        <h1 className="font-display text-display-2 text-charcoal-900 mb-8">Staff</h1>
      </motion.div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
        </div>
      ) : staff && staff.length > 0 ? (
        <div className="space-y-3">
          {staff.map((member) => (
            <Card key={member.id}>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-gold flex items-center justify-center text-charcoal-900 font-medium flex-shrink-0">
                  {member.full_name?.[0]?.toUpperCase() ?? 'S'}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-charcoal-900">{member.full_name ?? 'Unnamed'}</p>
                  <p className="text-sm text-charcoal-500 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    {member.email}
                  </p>
                </div>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-champagne-50 text-champagne-700 capitalize">
                  {member.role.replace('_', ' ')}
                </span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No Staff Members" description="Staff accounts will appear here." icon={<UserCog className="h-12 w-12" />} />
      )}
    </div>
  )
}

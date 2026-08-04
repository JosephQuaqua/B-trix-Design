import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import { supabase } from '@/config/supabase'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatDateTime } from '@/lib/format'

export default function AuditLogsPage() {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['admin', 'audit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      return data
    },
  })

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="eyebrow text-champagne-700 mb-2">Super Admin</p>
        <h1 className="font-display text-display-2 text-charcoal-900 mb-8">Audit Logs</h1>
      </motion.div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
        </div>
      ) : logs && logs.length > 0 ? (
        <div className="space-y-3">
          {logs.map((log) => (
            <Card key={log.id}>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-ivory-100 text-charcoal-500 flex-shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-charcoal-900 text-sm">{log.action}</p>
                  {log.entity_type && (
                    <p className="text-xs text-charcoal-400 mt-0.5">
                      {log.entity_type}{log.entity_id ? ` · ${log.entity_id.slice(0, 8)}...` : ''}
                    </p>
                  )}
                  <p className="text-xs text-charcoal-300 mt-1">{formatDateTime(log.created_at)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No Audit Logs" description="System actions will be recorded here." icon={<FileText className="h-12 w-12" />} />
      )}
    </div>
  )
}

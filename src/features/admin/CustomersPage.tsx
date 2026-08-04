import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Users, Mail, Calendar } from 'lucide-react'
import { supabase } from '@/config/supabase'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { formatDate } from '@/lib/format'

export default function CustomersPage() {
  const [search, setSearch] = useState('')

  const { data: customers, isLoading } = useQuery({
    queryKey: ['admin', 'customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'customer')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })

  const filtered = customers?.filter((c) =>
    c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  ) ?? []

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="eyebrow text-champagne-700 mb-2">Admin Panel</p>
        <h1 className="font-display text-display-2 text-charcoal-900 mb-8">Customers</h1>
      </motion.div>

      <div className="mb-6">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((customer) => (
            <Card key={customer.id}>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-gold flex items-center justify-center text-charcoal-900 font-medium flex-shrink-0">
                  {customer.full_name?.[0]?.toUpperCase() ?? 'C'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-charcoal-900">{customer.full_name ?? 'Unnamed'}</p>
                  <p className="text-sm text-charcoal-500 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    {customer.email}
                  </p>
                  <p className="text-xs text-charcoal-400 flex items-center gap-1.5 mt-1">
                    <Calendar className="h-3 w-3" />
                    Joined {formatDate(customer.created_at)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No Customers Found" description="No customers match your search." icon={<Users className="h-12 w-12" />} />
      )}
    </div>
  )
}

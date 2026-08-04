import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ShieldCheck, Lock, Users } from 'lucide-react'
import { supabase } from '@/config/supabase'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'

const roleInfo = [
  { role: 'customer', label: 'Customer', description: 'Can book appointments, manage favorites, and view their dashboard.', permissions: ['Book appointments', 'View collections', 'Save favorites', 'Manage measurements', 'Send messages'] },
  { role: 'staff', label: 'Staff', description: 'Can manage appointments, view customer profiles, and update statuses.', permissions: ['View all appointments', 'Update appointment status', 'View customer profiles', 'Manage measurements', 'Customer messaging', 'Manage availability'] },
  { role: 'admin', label: 'Admin', description: 'Full management access to gallery, collections, services, and reports.', permissions: ['Everything Staff can do', 'Manage gallery', 'Manage collections', 'Manage services', 'Manage reviews', 'View reports', 'Business settings'] },
  { role: 'super_admin', label: 'Super Admin', description: 'Complete system access including roles, analytics, and configuration.', permissions: ['Everything Admin can do', 'Manage roles', 'Create admins', 'View analytics', 'System configuration', 'Audit logs', 'Email templates', 'Security settings'] },
]

export default function RolesPage() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin', 'roles', 'users'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="eyebrow text-champagne-700 mb-2">Super Admin</p>
        <h1 className="font-display text-display-2 text-charcoal-900 mb-8">Roles & Permissions</h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {roleInfo.map((info, i) => (
          <motion.div key={info.role} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }}>
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-champagne-50 text-champagne-600">
                  {info.role === 'super_admin' ? <ShieldCheck className="h-5 w-5" /> : info.role === 'admin' ? <Lock className="h-5 w-5" /> : info.role === 'staff' ? <Users className="h-5 w-5" /> : <Users className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="font-display text-lg text-charcoal-900">{info.label}</h3>
                </div>
              </div>
              <p className="text-sm text-charcoal-500 mb-4">{info.description}</p>
              <ul className="space-y-1.5">
                {info.permissions.map((perm) => (
                  <li key={perm} className="text-sm text-charcoal-600 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-champagne-500" />
                    {perm}
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        ))}
      </div>

      <h2 className="font-display text-2xl text-charcoal-900 mb-4">User Roles</h2>
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {users?.map((user) => (
            <Card key={user.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-charcoal-900">{user.full_name ?? user.email}</p>
                </div>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-champagne-50 text-champagne-700 capitalize">
                  {user.role.replace('_', ' ')}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

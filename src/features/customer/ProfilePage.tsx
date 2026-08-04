import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { supabase } from '@/config/supabase'
import { useAuth } from '@/context/AuthContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function ProfilePage() {
  const { profile, refreshProfile } = useAuth()
  const queryClient = useQueryClient()
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [phone, setPhone] = useState('')
  const [saved, setSaved] = useState(false)

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName, phone })
        .eq('id', profile!.id)
      if (error) throw error
    },
    onSuccess: () => {
      refreshProfile()
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    },
  })

  return (
    <div className="p-6 lg:p-10 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="eyebrow text-champagne-700 mb-2">Dashboard</p>
        <h1 className="font-display text-display-2 text-charcoal-900 mb-8">My Profile</h1>
      </motion.div>

      <Card>
        <div className="flex items-center gap-4 mb-8">
          <div className="h-16 w-16 rounded-full bg-gradient-gold flex items-center justify-center text-charcoal-900 font-display text-2xl">
            {fullName?.[0]?.toUpperCase() ?? 'C'}
          </div>
          <div>
            <p className="font-display text-xl text-charcoal-900">{fullName || 'Your Name'}</p>
            <p className="text-sm text-charcoal-500">{profile?.email}</p>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate() }} className="space-y-5">
          <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" />
          <Input label="Email" value={profile?.email ?? ''} disabled />
          <Input label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" />
          <Button type="submit" variant="gold" loading={mutation.isPending}>
            Save Changes
          </Button>
          {saved && <p className="text-success-700 text-sm">Profile updated successfully.</p>}
          {mutation.isError && <p className="text-danger-700 text-sm">Failed to update. Please try again.</p>}
        </form>
      </Card>
    </div>
  )
}

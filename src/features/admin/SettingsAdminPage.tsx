import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save } from 'lucide-react'
import { supabase } from '@/config/supabase'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'

export default function SettingsAdminPage() {
  const queryClient = useQueryClient()
  const [values, setValues] = useState<Record<string, string>>({})

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('settings').select('*')
      if (error) throw error
      return data
    },
  })

  useEffect(() => {
    if (settings) {
      const map: Record<string, string> = {}
      settings.forEach((s) => { map[s.key] = s.value })
      setValues(map)
    }
  }, [settings])

  const updateMutation = useMutation({
    mutationFn: async () => {
      for (const [key, value] of Object.entries(values)) {
        const existing = settings?.find((s) => s.key === key)
        if (existing) {
          await supabase.from('settings').update({ value }).eq('key', key)
        } else {
          await supabase.from('settings').insert({ key, value })
        }
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] }),
  })

  const fields = [
    { key: 'business_name', label: 'Business Name' },
    { key: 'tagline', label: 'Tagline' },
    { key: 'contact_email', label: 'Contact Email' },
    { key: 'contact_phone', label: 'Contact Phone' },
    { key: 'studio_address', label: 'Studio Address' },
  ]

  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="eyebrow text-champagne-700 mb-2">Admin Panel</p>
        <h1 className="font-display text-display-2 text-charcoal-900 mb-8">Business Settings</h1>
      </motion.div>

      {isLoading ? (
        <Skeleton className="h-96 rounded-lg" />
      ) : (
        <Card>
          <form onSubmit={(e) => { e.preventDefault(); updateMutation.mutate() }} className="space-y-5">
            {fields.map((field) => (
              <Input
                key={field.key}
                label={field.label}
                value={values[field.key] ?? ''}
                onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
              />
            ))}
            <Button type="submit" variant="gold" loading={updateMutation.isPending}>
              <Save className="h-4 w-4" />
              Save Settings
            </Button>
            {updateMutation.isSuccess && <p className="text-success-700 text-sm">Settings saved successfully.</p>}
          </form>
        </Card>
      )}
    </div>
  )
}

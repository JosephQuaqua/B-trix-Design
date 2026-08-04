import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Ruler } from 'lucide-react'
import { supabase } from '@/config/supabase'
import { useAuth } from '@/context/AuthContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'

const measurementFields = [
  { key: 'bust', label: 'Bust (inches)' },
  { key: 'waist', label: 'Waist (inches)' },
  { key: 'hips', label: 'Hips (inches)' },
  { key: 'shoulder_width', label: 'Shoulder Width (inches)' },
  { key: 'arm_length', label: 'Arm Length (inches)' },
  { key: 'inseam', label: 'Inseam (inches)' },
  { key: 'height', label: 'Height (inches)' },
] as const

export default function MeasurementsPage() {
  const { profile } = useAuth()
  const queryClient = useQueryClient()
  const [values, setValues] = useState<Record<string, string>>({})
  const [notes, setNotes] = useState('')

  const { data: measurement, isLoading } = useQuery({
    queryKey: ['measurements', 'customer'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('measurements')
        .select('*')
        .eq('customer_id', profile!.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (error) throw error
      return data
    },
    enabled: !!profile,
  })

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        customer_id: profile!.id,
        bust: values.bust ? Number(values.bust) : null,
        waist: values.waist ? Number(values.waist) : null,
        hips: values.hips ? Number(values.hips) : null,
        shoulder_width: values.shoulder_width ? Number(values.shoulder_width) : null,
        arm_length: values.arm_length ? Number(values.arm_length) : null,
        inseam: values.inseam ? Number(values.inseam) : null,
        height: values.height ? Number(values.height) : null,
        notes: notes || null,
      }
      if (measurement?.id) {
        const { error } = await supabase.from('measurements').update(payload).eq('id', measurement.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('measurements').insert(payload)
        if (error) throw error
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['measurements'] }),
  })

  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="eyebrow text-champagne-700 mb-2">Dashboard</p>
        <h1 className="font-display text-display-2 text-charcoal-900 mb-8">My Measurements</h1>
      </motion.div>

      {isLoading ? (
        <Skeleton className="h-96 rounded-lg" />
      ) : (
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <Ruler className="h-6 w-6 text-champagne-600" />
            <p className="text-charcoal-600">Enter your measurements in inches. These help us prepare for your fitting.</p>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); mutation.mutate() }}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {measurementFields.map((field) => (
                <Input
                  key={field.key}
                  label={field.label}
                  type="number"
                  step="0.1"
                  defaultValue={measurement?.[field.key as keyof typeof measurement] as number ?? ''}
                  onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                  placeholder="0.0"
                />
              ))}
            </div>
            <Textarea
              label="Notes"
              defaultValue={measurement?.notes ?? ''}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any notes about your measurements..."
            />
            <Button type="submit" variant="gold" loading={mutation.isPending}>
              {measurement ? 'Update Measurements' : 'Save Measurements'}
            </Button>
            {mutation.isSuccess && (
              <p className="text-success-700 text-sm">Measurements saved successfully.</p>
            )}
            {mutation.isError && (
              <p className="text-danger-700 text-sm">Failed to save. Please try again.</p>
            )}
          </form>
        </Card>
      )}
    </div>
  )
}

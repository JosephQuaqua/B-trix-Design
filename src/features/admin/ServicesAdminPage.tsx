import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Trash2, Briefcase } from 'lucide-react'
import { supabase } from '@/config/supabase'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'

export default function ServicesAdminPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', slug: '', description: '', long_description: '', duration_minutes: '' })

  const { data: services, isLoading } = useQuery({
    queryKey: ['admin', 'services'],
    queryFn: async () => {
      const { data, error } = await supabase.from('services').select('*').order('sort_order')
      if (error) throw error
      return data
    },
  })

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('services').insert({
        title: form.title,
        slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-'),
        description: form.description,
        long_description: form.long_description || null,
        duration_minutes: form.duration_minutes ? Number(form.duration_minutes) : null,
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] })
      queryClient.invalidateQueries({ queryKey: ['services'] })
      setShowForm(false)
      setForm({ title: '', slug: '', description: '', long_description: '', duration_minutes: '' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('services').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'services'] }),
  })

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="eyebrow text-champagne-700 mb-2">Admin Panel</p>
            <h1 className="font-display text-display-2 text-charcoal-900">Services</h1>
          </div>
          <Button variant="gold" size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4" />
            Add Service
          </Button>
        </div>
      </motion.div>

      {showForm && (
        <Card className="mb-6">
          <h3 className="font-display text-lg text-charcoal-900 mb-4">New Service</h3>
          <form onSubmit={(e) => { e.preventDefault(); addMutation.mutate() }} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Input label="Duration (minutes)" type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })} />
            </div>
            <Input label="Short Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Textarea label="Long Description" value={form.long_description} onChange={(e) => setForm({ ...form, long_description: e.target.value })} />
            <div className="flex gap-3">
              <Button type="submit" variant="gold" loading={addMutation.isPending}>Save Service</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
        </div>
      ) : services && services.length > 0 ? (
        <div className="space-y-3">
          {services.map((svc) => (
            <Card key={svc.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-charcoal-900">{svc.title}</p>
                <p className="text-sm text-charcoal-500">{svc.description}</p>
                {svc.duration_minutes && <p className="text-xs text-charcoal-400 mt-1">{svc.duration_minutes} minutes</p>}
              </div>
              <div className="flex items-center gap-3">
                {svc.is_active ? (
                  <span className="text-xs text-success-700 bg-success-50 px-2 py-1 rounded-full">Active</span>
                ) : (
                  <span className="text-xs text-charcoal-400 bg-charcoal-100 px-2 py-1 rounded-full">Inactive</span>
                )}
                <button onClick={() => deleteMutation.mutate(svc.id)} className="text-charcoal-400 hover:text-danger-500 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No Services" description="Add your first service." icon={<Briefcase className="h-12 w-12" />} />
      )}
    </div>
  )
}

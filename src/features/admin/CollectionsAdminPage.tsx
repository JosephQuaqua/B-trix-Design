import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Trash2, FolderOpen } from 'lucide-react'
import { supabase } from '@/config/supabase'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { COLLECTION_CATEGORIES } from '@/lib/constants'

export default function CollectionsAdminPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', slug: '', description: '', category: 'white_wedding', fabric: '', color: '', image_url: '' })

  const { data: collections, isLoading } = useQuery({
    queryKey: ['admin', 'collections'],
    queryFn: async () => {
      const { data, error } = await supabase.from('collections').select('*').order('sort_order')
      if (error) throw error
      return data
    },
  })

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('collections').insert({
        title: form.title,
        slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-'),
        description: form.description,
        category: form.category,
        fabric: form.fabric || null,
        color: form.color || null,
        image_url: form.image_url || null,
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'collections'] })
      queryClient.invalidateQueries({ queryKey: ['collections'] })
      setShowForm(false)
      setForm({ title: '', slug: '', description: '', category: 'white_wedding', fabric: '', color: '', image_url: '' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('collections').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'collections'] }),
  })

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="eyebrow text-champagne-700 mb-2">Admin Panel</p>
            <h1 className="font-display text-display-2 text-charcoal-900">Collections</h1>
          </div>
          <Button variant="gold" size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4" />
            Add Collection
          </Button>
        </div>
      </motion.div>

      {showForm && (
        <Card className="mb-6">
          <h3 className="font-display text-lg text-charcoal-900 mb-4">New Collection</h3>
          <form onSubmit={(e) => { e.preventDefault(); addMutation.mutate() }} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated if empty" />
            </div>
            <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-md border border-ivory-300 bg-ivory-50 px-4 py-2.5 text-charcoal-800 focus:border-champagne-400 focus:ring-2 focus:ring-champagne-200"
                >
                  {COLLECTION_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <Input label="Fabric" value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })} />
              <Input label="Color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
            </div>
            <Input label="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
            <div className="flex gap-3">
              <Button type="submit" variant="gold" loading={addMutation.isPending}>Save Collection</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-lg" />)}
        </div>
      ) : collections && collections.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((col) => (
            <Card key={col.id} className="p-0 overflow-hidden group relative">
              <div className="aspect-[3/4] overflow-hidden bg-ivory-200">
                <img src={col.image_url ?? ''} alt={col.title} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="p-4">
                <p className="text-xs uppercase tracking-widest text-champagne-600 mb-1">
                  {COLLECTION_CATEGORIES.find((c) => c.value === col.category)?.label}
                </p>
                <h3 className="font-display text-lg text-charcoal-900">{col.title}</h3>
                {col.is_featured && <span className="text-xs text-champagne-600">Featured</span>}
              </div>
              <button
                onClick={() => deleteMutation.mutate(col.id)}
                className="absolute top-2 right-2 p-2 rounded-full bg-charcoal-950/60 text-ivory-50 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger-500"
                aria-label="Delete collection"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No Collections" description="Create your first collection." icon={<FolderOpen className="h-12 w-12" />} />
      )}
    </div>
  )
}

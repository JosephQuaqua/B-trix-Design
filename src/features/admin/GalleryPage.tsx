import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Image, Trash2, Plus } from 'lucide-react'
import { supabase } from '@/config/supabase'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'

export default function GalleryPage() {
  const queryClient = useQueryClient()
  const [newTitle, setNewTitle] = useState('')
const [newFile, setNewFile] = useState<File | null>(null)
  const [newCollectionId, setNewCollectionId] = useState('')
  const [showForm, setShowForm] = useState(false)

  const { data: collections } = useQuery({
  queryKey: ['admin', 'collections'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('collections')
      .select('id, title')
      .order('title')

    if (error) throw error
    return data
  },
})

  const { data: gallery, isLoading } = useQuery({
    queryKey: ['admin', 'gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('sort_order')
      if (error) throw error
      return data
    },
  })

  const addMutation = useMutation({
  mutationFn: async () => {
    if (!newFile) {
      throw new Error('Please select an image.')
    }

    const fileExt = newFile.name.split('.').pop()
    const fileName = `${crypto.randomUUID()}.${fileExt}`
    const filePath = `gallery/${fileName}`

    // Upload image to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('event-images')
      .upload(filePath, newFile, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) throw uploadError

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('event-images')
      .getPublicUrl(filePath)

    const imageUrl = publicUrlData.publicUrl

    // Save image information in gallery table
   const { error } = await supabase
  .from('gallery')
  .insert({
    title: newTitle || newFile.name,
    image_url: imageUrl,
    collection_id: newCollectionId,
  })

    if (error) throw error
  },
    onSuccess: () => {
  setNewTitle('')
  setNewFile(null)
  queryClient.invalidateQueries({ queryKey: ['admin', 'gallery'] })
},
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('gallery').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'gallery'] }),
  })

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="flex items-end justify-between mb-8"
>
  <div>
    <p className="eyebrow text-champagne-700 mb-2">Admin Panel</p>
    <h1 className="font-display text-display-2 text-charcoal-900">
      Gallery Management
    </h1>
  </div>

  <Button
    variant="gold"
    size="sm"
    onClick={() => setShowForm(!showForm)}
  >
    <Plus className="h-4 w-4" />
    Add Image
  </Button>
</motion.div>

      {showForm && (
  <Card className="mb-8">
        <h3 className="font-display text-lg text-charcoal-900 mb-4">Add New Image</h3>
       <form onSubmit={(e) => {
  e.preventDefault()
  if (newFile && newCollectionId) addMutation.mutate()
}} className="flex flex-col sm:flex-row gap-3">
          {/* <Input placeholder="Image title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="flex-1" /> */}
          <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0]

    if (file) {
      setNewFile(file)
    }
  }}
  className="flex-1 rounded-md border border-ivory-300 bg-ivory-50 px-4 py-2.5 text-charcoal-800"
/>
          <select
           required
  value={newCollectionId}
  onChange={(e) => setNewCollectionId(e.target.value)}
  className="flex-1 rounded-md border border-ivory-300 bg-ivory-50 px-4 py-2.5 text-charcoal-800"
>
  <option value="">Select Collection</option>

  {collections?.map((collection) => (
    <option key={collection.id} value={collection.id}>
      {collection.title}
    </option>
  ))}
</select>
          <Button type="submit" variant="gold" loading={addMutation.isPending}>
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </form>
      </Card>

      )}

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-lg" />)}
        </div>
      ) : gallery && gallery.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {gallery.map((item) => (
            <Card key={item.id} className="p-0 overflow-hidden group relative">
              <div className="aspect-square overflow-hidden bg-ivory-200">
                <img src={item.image_url} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-charcoal-800 truncate">{item.title}</p>
              </div>
              <button
                onClick={() => deleteMutation.mutate(item.id)}
                className="absolute top-2 right-2 p-2 rounded-full bg-charcoal-950/60 text-ivory-50 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger-500"
                aria-label="Delete image"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No Gallery Images" description="Add images to showcase your work." icon={<Image className="h-12 w-12" />} />
      )}
    </div>
  )
}

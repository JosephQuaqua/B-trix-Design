import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Send, MessageSquare } from 'lucide-react'
import { supabase } from '@/config/supabase'
import { useAuth } from '@/context/AuthContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { timeAgo } from '@/lib/format'

export default function MessagesAdminPage() {
  const { profile } = useAuth()
  const queryClient = useQueryClient()
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [body, setBody] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const { data: threads } = useQuery({
    queryKey: ['admin', 'messages', 'threads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*, customer:profiles!messages_customer_id_fkey(full_name, email)')
        .order('created_at', { ascending: false })
      if (error) throw error
      const grouped = new Map<string, { customer: typeof data[0]['customer']; lastMessage: string; created_at: string }>()
      for (const msg of data) {
        if (!grouped.has(msg.customer_id)) {
          grouped.set(msg.customer_id, { customer: msg.customer, lastMessage: msg.body, created_at: msg.created_at })
        }
      }
      return Array.from(grouped.entries()).map(([id, val]) => ({ id, ...val }))
    },
  })

  const { data: conversation } = useQuery({
    queryKey: ['admin', 'messages', selectedCustomer],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('customer_id', selectedCustomer!)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data
    },
    enabled: !!selectedCustomer,
  })

  const sendMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('messages').insert({
        customer_id: selectedCustomer!,
        staff_id: profile!.id,
        sender_role: 'staff',
        body,
      })
      if (error) throw error
    },
    onSuccess: () => {
      setBody('')
      queryClient.invalidateQueries({ queryKey: ['admin', 'messages'] })
    },
  })

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [conversation])

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="eyebrow text-champagne-700 mb-2">Admin Panel</p>
        <h1 className="font-display text-display-2 text-charcoal-900 mb-8">Messages</h1>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-0">
          <div className="border-b border-ivory-200 px-4 py-3">
            <p className="font-medium text-charcoal-900 text-sm">Conversations</p>
          </div>
          {threads && threads.length > 0 ? (
            <div className="divide-y divide-ivory-200">
              {threads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => setSelectedCustomer(thread.id)}
                  className={`w-full text-left px-4 py-3 hover:bg-ivory-100 transition-colors ${selectedCustomer === thread.id ? 'bg-ivory-100' : ''}`}
                >
                  <p className="font-medium text-charcoal-800 text-sm">{thread.customer?.full_name ?? thread.customer?.email}</p>
                  <p className="text-xs text-charcoal-400 truncate mt-0.5">{thread.lastMessage}</p>
                  <p className="text-xs text-charcoal-300 mt-0.5">{timeAgo(thread.created_at)}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6"><Skeleton className="h-16 rounded-lg" /></div>
          )}
        </Card>

        <Card className="p-0 lg:col-span-2">
          {selectedCustomer ? (
            <>
              <div ref={scrollRef} className="h-96 overflow-y-auto p-6 space-y-4">
                {conversation?.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender_role === 'staff' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-lg px-4 py-3 ${msg.sender_role === 'staff' ? 'bg-gradient-gold text-charcoal-900' : 'bg-ivory-100 text-charcoal-800 border border-ivory-200'}`}>
                      <p className="text-sm leading-relaxed">{msg.body}</p>
                      <p className="text-xs mt-1 opacity-60">{timeAgo(msg.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-ivory-200 p-4">
                <form onSubmit={(e) => { e.preventDefault(); if (body.trim()) sendMutation.mutate() }} className="flex gap-3">
                  <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Reply..." className="min-h-[44px] resize-none" />
                  <Button type="submit" variant="gold" loading={sendMutation.isPending} className="flex-shrink-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <EmptyState title="Select a Conversation" description="Choose a customer from the list to view their messages." icon={<MessageSquare className="h-12 w-12" />} />
          )}
        </Card>
      </div>
    </div>
  )
}

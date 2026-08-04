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

export default function MessagesPage() {
  const { profile } = useAuth()
  const queryClient = useQueryClient()
  const [body, setBody] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', 'customer'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('customer_id', profile!.id)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data
    },
    enabled: !!profile,
  })

  const sendMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('messages').insert({
        customer_id: profile!.id,
        sender_role: 'customer',
        body,
      })
      if (error) throw error
    },
    onSuccess: () => {
      setBody('')
      queryClient.invalidateQueries({ queryKey: ['messages', 'customer'] })
    },
  })

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="eyebrow text-champagne-700 mb-2">Dashboard</p>
        <h1 className="font-display text-display-2 text-charcoal-900 mb-8">Messages</h1>
      </motion.div>

      <Card className="p-0 overflow-hidden">
        <div className="border-b border-ivory-200 px-6 py-4">
          <p className="font-medium text-charcoal-900">Conversation with B'trix Design</p>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
          </div>
        ) : messages && messages.length > 0 ? (
          <>
            <div ref={scrollRef} className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_role === 'customer' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-4 py-3 ${
                      msg.sender_role === 'customer'
                        ? 'bg-gradient-gold text-charcoal-900'
                        : 'bg-ivory-100 text-charcoal-800 border border-ivory-200'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.body}</p>
                    <p className={`text-xs mt-1 ${msg.sender_role === 'customer' ? 'text-charcoal-700' : 'text-charcoal-400'}`}>
                      {timeAgo(msg.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-ivory-200 p-4">
              <form
                onSubmit={(e) => { e.preventDefault(); if (body.trim()) sendMutation.mutate() }}
                className="flex gap-3"
              >
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Type your message..."
                  className="min-h-[44px] resize-none"
                />
                <Button type="submit" variant="gold" size="md" loading={sendMutation.isPending} className="flex-shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <EmptyState
            title="No Messages Yet"
            description="Start a conversation with our team about your design."
            icon={<MessageSquare className="h-12 w-12" />}
          />
        )}
      </Card>
    </div>
  )
}

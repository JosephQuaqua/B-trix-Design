import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Mail,
  Phone,
  Search,
  RefreshCw,
  Calendar,
  User,
  MessageSquare,
} from 'lucide-react'
import { supabase } from '@/config/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

type ContactMessage = {
  id: string
  customer_id: string | null
  first_name: string
  last_name: string
  email: string
  phone: string
  subject: string
  message: string
  status: string
  admin_reply: string | null
  created_at: string
}

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [selected, setSelected] = useState<ContactMessage | null>(null)
  const [loading, setLoading] = useState(true)
const [search, setSearch] = useState('')
const [replyText, setReplyText] = useState('')
const [replying, setReplying] = useState(false)

const PAGE_SIZE = 10

const [page, setPage] = useState(1)
const [totalMessages, setTotalMessages] = useState(0)

  useEffect(() => {
  loadMessages()
}, [page])

async function loadMessages() {
  setLoading(true)

  const { data, error, count } = await supabase
    .from('contact_messages')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(
      (page - 1) * PAGE_SIZE,
      page * PAGE_SIZE - 1
    )

  if (error) {
    console.error(error)
  } else {
    setMessages(data ?? [])
    setTotalMessages(count ?? 0)
    setSelected(null)
  }

  setLoading(false)
}


// SEND REPLY
async function handleReply() {
  if (!selected) return

  if (!replyText.trim()) {
    alert('Please write a reply first.')
    return
  }



  setReplying(true)

  const { data, error } = await supabase
    .from('contact_messages')
    .update({
      admin_reply: replyText.trim(),
      status: 'replied',
    })
    .eq('id', selected.id)
    .select()
    .single()

  if (error) {
    console.error(error)
    alert('Failed to send reply.')
  } else {
    setSelected(data)
    setReplyText('')
    
    // Refresh message list
    await loadMessages()
    
    // Keep the replied message selected
    setSelected(data)
  }

  setReplying(false)
}

// MARK MESSAGE AS READ
async function handleMarkAsRead() {
  if (!selected) return

  const { data, error } = await supabase
    .from('contact_messages')
    .update({
      status: 'read',
    })
    .eq('id', selected.id)
    .select()
    .single()

  if (error) {
    console.error(error)
    alert('Failed to mark message as read.')
    return
  }

  // Update selected message
  setSelected(data)

  // Update message in the current list
  setMessages((currentMessages) =>
    currentMessages.map((message) =>
      message.id === data.id ? data : message
    )
  )
}

// DELETE MESSAGE
async function handleDelete() {
  if (!selected) return

  const confirmed = window.confirm(
    'Are you sure you want to delete this message? This action cannot be undone.'
  )

  if (!confirmed) return

  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', selected.id)

  if (error) {
    console.error(error)
    alert('Failed to delete message.')
    return
  }

  // Remove deleted message from the list
  setMessages((currentMessages) =>
    currentMessages.filter(
      (message) => message.id !== selected.id
    )
  )

  // Clear selected message
  setSelected(null)

  // Update total count
  setTotalMessages((currentTotal) =>
    Math.max(0, currentTotal - 1)
  )
}


const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      const keyword = search.toLowerCase()

      return (
        m.first_name.toLowerCase().includes(keyword) ||
        m.last_name.toLowerCase().includes(keyword) ||
        m.email.toLowerCase().includes(keyword) ||
        m.subject.toLowerCase().includes(keyword)
      )
    })
  }, [messages, search])

 const total = totalMessages

  const unread = messages.filter(
    (m) => m.status === 'new'
  ).length

  const replied = messages.filter(
    (m) => m.status === 'replied'
  ).length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 p-8"
    >
      {/* Header */}

      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">

        <div>
          <h1 className="font-display text-4xl text-charcoal-900">
            Contact Messages
          </h1>

          <p className="text-charcoal-500 mt-2">
            Manage all enquiries submitted from your website.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={loadMessages}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>

      </div>

      {/* Statistics */}

      <div className="grid md:grid-cols-3 gap-6">

        <div className="rounded-2xl bg-white border border-ivory-300 p-6 shadow-soft">
          <p className="text-charcoal-500 text-sm">
            Total Messages
          </p>

          <h2 className="mt-2 text-4xl font-bold text-charcoal-900">
            {total}
          </h2>
        </div>

        <div className="rounded-2xl bg-white border border-ivory-300 p-6 shadow-soft">
          <p className="text-charcoal-500 text-sm">
            New
          </p>

          <h2 className="mt-2 text-4xl font-bold text-champagne-600">
            {unread}
          </h2>
        </div>

        <div className="rounded-2xl bg-white border border-ivory-300 p-6 shadow-soft">
          <p className="text-charcoal-500 text-sm">
            Replied
          </p>

          <h2 className="mt-2 text-4xl font-bold text-success-500">
            {replied}
          </h2>
        </div>

      </div>

      {/* Inbox */}

      <div className="grid lg:grid-cols-12 gap-8">

        {/* LEFT PANEL */}

<div className="lg:col-span-4 rounded-3xl bg-white border border-ivory-300 shadow-soft overflow-hidden">

  {/* SEARCH */}
  <div className="p-5 border-b border-ivory-200">

    <div className="relative">

      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-400" />

      <Input
        placeholder="Search customer..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-11"
      />

    </div>

  </div>


  {/* MESSAGE AREA + PAGINATION */}
  <div className="flex flex-col h-[700px]">


    {/* MESSAGE LIST SCROLL */}
    <div className="flex-1 overflow-y-auto">

      {loading ? (

        <div className="p-8 text-center text-charcoal-500">
          Loading...
        </div>


      ) : filteredMessages.length === 0 ? (


        <div className="p-8 text-center text-charcoal-500">
          No messages found.
        </div>


      ) : (


        filteredMessages.map((message) => (

          <button
            key={message.id}
            onClick={() => setSelected(message)}
            className={`w-full text-left px-6 py-5 border-b border-ivory-100 transition-all ${
              selected?.id === message.id
                ? 'bg-champagne-50'
                : 'hover:bg-ivory-50'
            }`}
          >


            <div className="flex justify-between items-center">

              <h3 className="font-semibold text-charcoal-900">
                {message.first_name} {message.last_name}
              </h3>


              {message.status === 'new' && (
                <span className="h-3 w-3 rounded-full bg-champagne-500" />
              )}

            </div>


            <p className="mt-2 text-sm text-charcoal-600 truncate">
              {message.subject}
            </p>


            <p className="mt-2 text-xs text-charcoal-400">
              {new Date(message.created_at).toLocaleDateString()}
            </p>


          </button>

        ))

      )}

    </div>



    {/* PAGINATION */}

    <div className="border-t border-ivory-200 p-4 flex items-center justify-between bg-white">


      <p className="text-sm text-charcoal-500">

        Page {page} of {Math.max(1, Math.ceil(totalMessages / PAGE_SIZE))}

      </p>



      <div className="flex gap-2">


        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => {
            setSelected(null)
            setPage(page - 1)
          }}
        >
          Previous
        </Button>



        <Button
          variant="outline"
          size="sm"
          disabled={page >= Math.ceil(totalMessages / PAGE_SIZE)}
          onClick={() => {
            setSelected(null)
            setPage(page + 1)
          }}
        >
          Next
        </Button>


      </div>


    </div>


  </div>


</div>



{/* RIGHT PANEL */}

<div className="lg:col-span-8 rounded-3xl bg-white border border-ivory-300 shadow-soft">

                    {selected ? (
            <div className="h-full flex flex-col">

              {/* Header */}

              <div className="border-b border-ivory-200 p-8">

                <div className="flex flex-col lg:flex-row justify-between gap-6">

                  <div>

                    <h2 className="text-3xl font-display text-charcoal-900">
                      {selected.subject}
                    </h2>

                    <div className="mt-5 space-y-3">

                      <div className="flex items-center gap-3 text-charcoal-700">
                        <User className="h-4 w-4 text-champagne-600" />
                        <span>
                          {selected.first_name} {selected.last_name}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-charcoal-700">
                        <Mail className="h-4 w-4 text-champagne-600" />
                        <span>{selected.email}</span>
                      </div>

                      {selected.phone && (
                        <div className="flex items-center gap-3 text-charcoal-700">
                          <Phone className="h-4 w-4 text-champagne-600" />
                          <span>{selected.phone}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-charcoal-700">
                        <Calendar className="h-4 w-4 text-champagne-600" />
                        <span>
                          {new Date(selected.created_at).toLocaleString()}
                        </span>
                      </div>

                    </div>

                  </div>

                  <div>

                    <span
                      className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${
                        selected.status === 'new'
                          ? 'bg-champagne-100 text-champagne-700'
                          : selected.status === 'replied'
                          ? 'bg-success-100 text-success-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {selected.status.toUpperCase()}
                    </span>

                  </div>

                </div>

              </div>

              {/* Message */}

              <div className="flex-1 p-8 overflow-y-auto">

                <div className="rounded-2xl bg-ivory-50 border border-ivory-200 p-8">

                  <div className="flex items-center gap-3 mb-6">

                    <MessageSquare className="h-5 w-5 text-champagne-600" />

                    <h3 className="font-semibold text-xl text-charcoal-900">
                      Customer Message
                    </h3>

                  </div>

                  <p className="leading-8 whitespace-pre-wrap text-charcoal-700">
                    {selected.message}
                  </p>

                </div>

                {selected.admin_reply && (

                  <div className="rounded-2xl bg-success-50 border border-success-200 p-8 mt-8">

                    <h3 className="font-semibold text-xl mb-4 text-success-700">
                      Admin Reply
                    </h3>

                    <p className="whitespace-pre-wrap leading-8 text-charcoal-700">
                      {selected.admin_reply}
                    </p>

                  </div>

                )}

              </div>

              {/* REPLY AREA */}

<div className="border-t border-ivory-200 p-6">

  <div className="space-y-4">

    <textarea
      value={replyText}
      onChange={(e) => setReplyText(e.target.value)}
      placeholder="Write your reply to the customer..."
      rows={5}
      className="w-full rounded-2xl border border-ivory-300 bg-white px-5 py-4 text-charcoal-700 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-champagne-300 resize-none"
    />

    <div className="flex flex-wrap gap-4">

      <Button
        variant="gold"
        onClick={handleReply}
        disabled={replying || !replyText.trim()}
      >
        {replying ? 'Sending...' : 'Send Reply'}
      </Button>

      <Button
        variant="outline"
        onClick={() => setReplyText('')}
        disabled={replying}
      >
        Clear
      </Button>

      <Button
  variant="outline"
  onClick={handleMarkAsRead}
  disabled={selected.status !== 'new'}
>
  {selected.status === 'new' ? 'Mark as Read' : 'Already Read'}
</Button>

     <Button
  variant="outline"
  onClick={handleDelete}
>
  Delete
</Button>

    </div>

  </div>

</div>
            </div>

          ) : (

            <div className="h-full flex items-center justify-center p-12">

              <div className="text-center">

                <Mail className="h-16 w-16 mx-auto text-charcoal-300" />

                <h2 className="mt-6 text-2xl font-display text-charcoal-900">
                  No Message Selected
                </h2>

                <p className="mt-3 text-charcoal-500">
                  Select a message from the left to read it.
                </p>

              </div>

            </div>

          )}
        </div> 
        {/* RIGHT PANEL */}

      </div>
      {/* GRID */}

    </motion.div>
  )
}
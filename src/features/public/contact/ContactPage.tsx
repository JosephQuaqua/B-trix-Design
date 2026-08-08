import { supabase } from '@/config/supabase'
import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { SITE } from '@/config/site'

export default function ContactPage() {

  const { user } = useAuth()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  

const [firstName, setFirstName] = useState('')
const [lastName, setLastName] = useState('')
const [email, setEmail] = useState('')
const [phone, setPhone] = useState('')
const [subject, setSubject] = useState('')
const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)

  const { error } = await supabase
  .from('contact_messages')
    .insert({
  customer_id: user?.id ??null,

  first_name: firstName,
  last_name: lastName,
  email,
  phone,
  subject,
  message,

  status: 'new',
})
  setLoading(false)

  if (error) {
   console.error(error)

alert(error.message)
    return
  }

  setSubmitted(true)
  setFirstName('')
setLastName('')
setEmail('')
setPhone('')
setSubject('')
setMessage('')
}

  return (
    <>
      <section className="pt-32 pb-12 bg-gradient-hero">
        <div className="container-luxury text-center">
          <p className="eyebrow text-champagne-700 mb-4">Get in Touch</p>
          <h1 className="font-display text-display-1 text-charcoal-900">Contact Us</h1>
          <p className="mt-4 max-w-2xl mx-auto text-charcoal-500 text-lg">
            Have a question or want to learn more? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="pb-24 bg-ivory-50">
        <div className="container-luxury">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-display-2 text-charcoal-900 mb-6">Visit Our Atelier</h2>
              <p className="text-charcoal-600 leading-relaxed mb-8">
                Located in the heart of Monrovia, our studio welcomes clients by appointment. Reach out using the form or through any of the channels below.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-champagne-50 text-champagne-600 flex-shrink-0">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-charcoal-400 uppercase tracking-wider mb-1">Email</p>
                    <a href={`mailto:${SITE.email}`} className="text-charcoal-800 hover:text-champagne-600 transition-colors">{SITE.email}</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-champagne-50 text-champagne-600 flex-shrink-0">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-charcoal-400 uppercase tracking-wider mb-1">Phone</p>
                    <p className="text-charcoal-800">{SITE.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-champagne-50 text-champagne-600 flex-shrink-0">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-charcoal-400 uppercase tracking-wider mb-1">Address</p>
                    <p className="text-charcoal-800">{SITE.address}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="card-luxury p-8"
            >
              {submitted ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-success-50 text-success-500 mb-4">
                    <Send className="h-8 w-8" />
                  </div>
                  <h3 className="font-display text-2xl text-charcoal-900 mb-2">Message Sent</h3>
                  <p className="text-charcoal-500">Thank you for reaching out. We'll get back to you within 48 hours.</p>
                  <Button variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>Send Another</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <Input
                          label="First Name"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Sarah"
                        />
                   <Input
  label="Last Name"
  required
  value={lastName}
  onChange={(e) => setLastName(e.target.value)}
  placeholder="Johnson"
/>
                  </div>
                  <Input
  label="Email"
  type="email"
  required
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="sarah@example.com"
/>
                  <Input
  label="Phone"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  placeholder="+231..."
/>
                 <Input
  label="Subject"
  required
  value={subject}
  onChange={(e) => setSubject(e.target.value)}
  placeholder="Consultation inquiry"
/>
                  <Textarea
  label="Message"
  required
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  placeholder="Tell us about your vision..."
/>
                  <Button type="submit" variant="gold" size="lg" loading={loading} className="w-full">
                    Send Message
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

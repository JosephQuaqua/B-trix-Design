import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, Upload, Calendar, Clock, FileText } from 'lucide-react'
import { supabase } from '@/config/supabase'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { COLLECTION_CATEGORIES } from '@/lib/constants'
import { cn } from '@/lib/cn'

const steps = ['Service', 'Date & Time', 'Details', 'Confirm']

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
]

export default function BookingPage() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [serviceId, setServiceId] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [imageUrl, setImageUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const today = new Date().toISOString().split('T')[0]

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setImages([...images, imageUrl.trim()])
      setImageUrl('')
    }
  }

  const handleSubmit = async () => {
    if (!profile) {
      navigate('/login', { state: { from: '/book-appointment' } })
      return
    }
    setSubmitting(true)
    setError(null)
    const { error } = await supabase.from('appointments').insert({
      customer_id: profile.id,
      service_id: serviceId,
      preferred_date: date,
      preferred_time: time,
      notes,
      inspiration_images: images,
      status: 'pending',
    })
    setSubmitting(false)
    if (error) {
      setError(error.message)
    } else {
      navigate('/book-appointment/success')
    }
  }

  const canProceed = () => {
    if (step === 0) return !!serviceId
    if (step === 1) return !!date && !!time
    if (step === 2) return true
    return true
  }

  return (
    <section className="pt-32 pb-24 bg-ivory-50 min-h-screen">
      <div className="container-luxury max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <p className="eyebrow text-champagne-700 mb-4">Book an Appointment</p>
          <h1 className="font-display text-display-2 text-charcoal-900">Schedule Your Consultation</h1>
        </motion.div>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex items-center justify-center h-10 w-10 rounded-full border-2 transition-all duration-300',
                    i < step && 'bg-success-500 border-success-500 text-ivory-50',
                    i === step && 'bg-champagne-500 border-champagne-500 text-charcoal-900',
                    i > step && 'bg-ivory-100 border-ivory-300 text-charcoal-400',
                  )}
                >
                  {i < step ? <Check className="h-5 w-5" /> : i + 1}
                </div>
                <span className={cn('text-xs mt-2 hidden sm:block', i <= step ? 'text-charcoal-700' : 'text-charcoal-400')}>{label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={cn('h-0.5 w-12 sm:w-20 mx-2 transition-all duration-300', i < step ? 'bg-success-500' : 'bg-ivory-300')} />
              )}
            </div>
          ))}
        </div>

        <Card>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="service" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <h2 className="font-display text-xl text-charcoal-900 mb-2">Select a Service</h2>
                <p className="text-charcoal-500 text-sm mb-6">Choose the service you'd like to book.</p>
                <ServiceSelector value={serviceId} onChange={setServiceId} />
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="datetime" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <h2 className="font-display text-xl text-charcoal-900 mb-2">Choose Date & Time</h2>
                <p className="text-charcoal-500 text-sm mb-6">Select your preferred date and time slot.</p>
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-charcoal-700 mb-2">
                      <Calendar className="h-4 w-4 text-champagne-600" />
                      Preferred Date
                    </label>
                    <Input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} required />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-charcoal-700 mb-3">
                      <Clock className="h-4 w-4 text-champagne-600" />
                      Preferred Time
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setTime(slot)}
                          className={cn(
                            'px-3 py-2 rounded-md text-sm font-medium border transition-all',
                            time === slot
                              ? 'bg-charcoal-900 text-ivory-50 border-charcoal-900'
                              : 'bg-ivory-50 text-charcoal-600 border-ivory-300 hover:border-champagne-400',
                          )}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <h2 className="font-display text-xl text-charcoal-900 mb-2">Additional Details</h2>
                <p className="text-charcoal-500 text-sm mb-6">Share your vision and inspiration images.</p>
                <div className="space-y-5">
                  <Textarea
                    label="Notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tell us about your vision, style preferences, fabric choices, or any special requests..."
                  />
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-charcoal-700 mb-2">
                      <Upload className="h-4 w-4 text-champagne-600" />
                      Inspiration Images
                    </label>
                    <p className="text-xs text-charcoal-400 mb-3">Add URLs of inspiration photos you'd like to share.</p>
                    <div className="flex gap-2">
                      <Input
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/dress-photo.jpg"
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddImage() } }}
                      />
                      <Button type="button" variant="outline" onClick={handleAddImage}>Add</Button>
                    </div>
                    {images.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {images.map((img, i) => (
                          <div key={i} className="relative">
                            <img src={img} alt={`Inspiration ${i + 1}`} className="h-20 w-20 object-cover rounded-md border border-ivory-300" />
                            <button
                              onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                              className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-danger-500 text-ivory-50 text-xs flex items-center justify-center"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <h2 className="font-display text-xl text-charcoal-900 mb-2">Review & Confirm</h2>
                <p className="text-charcoal-500 text-sm mb-6">Please review your appointment details.</p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-md bg-ivory-100">
                    <FileText className="h-5 w-5 text-champagne-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-charcoal-400">Service</p>
                      <p className="text-charcoal-800 font-medium">Selected service</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-md bg-ivory-100">
                    <Calendar className="h-5 w-5 text-champagne-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-charcoal-400">Date & Time</p>
                      <p className="text-charcoal-800 font-medium">{date} at {time}</p>
                    </div>
                  </div>
                  {notes && (
                    <div className="flex items-start gap-3 p-4 rounded-md bg-ivory-100">
                      <FileText className="h-5 w-5 text-champagne-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-charcoal-400">Notes</p>
                        <p className="text-charcoal-800">{notes}</p>
                      </div>
                    </div>
                  )}
                  {images.length > 0 && (
                    <div className="p-4 rounded-md bg-ivory-100">
                      <p className="text-sm text-charcoal-400 mb-2">Inspiration Images ({images.length})</p>
                      <div className="flex flex-wrap gap-2">
                        {images.map((img, i) => (
                          <img key={i} src={img} alt={`Inspiration ${i + 1}`} className="h-16 w-16 object-cover rounded-md border border-ivory-300" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {error && <p className="text-danger-700 text-sm mt-4">{error}</p>}
                {!profile && (
                  <div className="mt-4 p-4 rounded-md bg-warning-50 border border-warning-500/30 text-warning-700 text-sm">
                    You'll need to <Link to="/login" className="font-medium underline">sign in</Link> to submit your appointment request.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-ivory-200">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
            >
              Back
            </Button>
            {step < 3 ? (
              <Button
                variant="gold"
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="gold"
                onClick={handleSubmit}
                loading={submitting}
                disabled={!profile}
              >
                Submit Request
              </Button>
            )}
          </div>
        </Card>
      </div>
    </section>
  )
}

function ServiceSelector({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const { data: services, isLoading } = useServicesQuery()

  if (isLoading) {
    return <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 rounded-md bg-ivory-100 animate-pulse" />)}</div>
  }

  return (
    <div className="space-y-2">
      {services?.map((svc: { id: string; title: string; description: string | null; duration_minutes: number | null }) => (
        <button
          key={svc.id}
          onClick={() => onChange(svc.id)}
          className={cn(
            'w-full text-left p-4 rounded-md border transition-all',
            value === svc.id ? 'border-champagne-500 bg-champagne-50' : 'border-ivory-300 bg-ivory-50 hover:border-champagne-300',
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-charcoal-900">{svc.title}</p>
              <p className="text-sm text-charcoal-500">{svc.description}</p>
            </div>
            {svc.duration_minutes && <span className="text-xs text-charcoal-400">{svc.duration_minutes} min</span>}
          </div>
        </button>
      ))}
    </div>
  )
}

import { useQuery } from '@tanstack/react-query'

function useServicesQuery() {
  return useQuery({
    queryKey: ['services', 'active', 'booking'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('id, title, description, duration_minutes')
        .eq('is_active', true)
        .order('sort_order')
      if (error) throw error
      return data
    },
  })
}

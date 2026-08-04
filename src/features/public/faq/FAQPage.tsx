import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { supabase } from '@/config/supabase'
import { Skeleton } from '@/components/ui/Skeleton'

const fallbackFAQ = [
  { id: '1', question: 'How do I book a consultation?', answer: 'Simply click the "Book Appointment" button on any page, select your preferred service, date, and time, and submit your request. You\'ll need to create an account or log in. Our team will review your request and send a confirmation email.', category: 'booking' },
  { id: '2', question: 'Do I need an appointment to visit the studio?', answer: 'Yes, all visits are by appointment only to ensure each client receives our full attention and a personalized experience.', category: 'visiting' },
  { id: '3', question: 'How far in advance should I book my wedding dress consultation?', answer: 'We recommend booking at least 6-8 months before your wedding date for custom designs. For alterations, 2-3 months is typically sufficient.', category: 'timeline' },
  { id: '4', question: 'Do you offer alterations on dresses not purchased from B\'trix Design?', answer: 'Yes, we offer alteration services on dresses from other designers. Please book an alteration appointment and bring your dress with you.', category: 'alterations' },
  { id: '5', question: 'What is the price range for custom wedding dresses?', answer: 'Each custom design is unique. Pricing depends on fabric, complexity, and detailing. We discuss all pricing during your initial consultation.', category: 'pricing' },
  { id: '6', question: 'Can I see examples of your work?', answer: 'Absolutely! Visit our Collections page to view our portfolio of white wedding dresses, Liberian traditional attire, evening wear, and custom designs.', category: 'collections' },
  { id: '7', question: 'Do you create Liberian traditional wedding attire?', answer: 'Yes, Liberian traditional wedding attire is one of our specialties. We combine authentic cultural elements with modern tailoring for a truly unique look.', category: 'liberian' },
  { id: '8', question: 'What should I bring to my consultation?', answer: 'Bring any inspiration photos, fabric swatches, or ideas you have. If you have an existing dress for alterations, please bring it as well.', category: 'consultation' },
  { id: '9', question: 'How long does a custom dress take to complete?', answer: 'Custom designs typically take 4-6 months depending on complexity. We\'ll provide a detailed timeline during your consultation.', category: 'timeline' },
  { id: '10', question: 'Do you offer payment plans?', answer: 'We offer flexible payment options for custom designs. Details are discussed during your consultation based on your specific project.', category: 'pricing' },
]

export default function FAQPage() {
  const [openId, setOpenId] = useState<string | null>('1')

  const { data, isLoading } = useQuery({
    queryKey: ['faq', 'published'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faq')
        .select('*')
        .eq('is_published', true)
        .order('sort_order')
      if (error) throw error
      return data.length > 0 ? data : fallbackFAQ
    },
    staleTime: 1000 * 60 * 5,
  })

  const faqs = data ?? fallbackFAQ

  return (
    <>
      <section className="pt-32 pb-12 bg-gradient-hero">
        <div className="container-luxury text-center">
          <p className="eyebrow text-champagne-700 mb-4">Questions & Answers</p>
          <h1 className="font-display text-display-1 text-charcoal-900">FAQ</h1>
          <p className="mt-4 max-w-2xl mx-auto text-charcoal-500 text-lg">
            Everything you need to know about working with B'trix Design.
          </p>
        </div>
      </section>

      <section className="pb-24 bg-ivory-50">
        <div className="container-luxury max-w-3xl">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {faqs.map((faq) => (
                <div key={faq.id} className="card-luxury overflow-hidden">
                  <button
                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                    className="flex items-center justify-between w-full p-6 text-left"
                  >
                    <span className="font-display text-lg text-charcoal-900 pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 flex-shrink-0 text-champagne-600 transition-transform duration-300 ${openId === faq.id ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {openId === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 text-charcoal-600 leading-relaxed">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

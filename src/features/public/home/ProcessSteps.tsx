import { motion } from 'framer-motion'
import { Calendar, MessageSquare, Scissors, Sparkles } from 'lucide-react'

const steps = [
  {
    icon: Calendar,
    title: 'Book Consultation',
    description: 'Schedule a personalized consultation with our lead designer to discuss your vision.',
  },
  {
    icon: MessageSquare,
    title: 'Design Discussion',
    description: 'We explore fabrics, silhouettes, and cultural elements to bring your vision to life.',
  },
  {
    icon: Scissors,
    title: 'Crafting & Fittings',
    description: 'Our atelier crafts your garment with precision, including multiple fitting sessions.',
  },
  {
    icon: Sparkles,
    title: 'Final Reveal',
    description: 'Your completed masterpiece is revealed, ready for your special day.',
  },
]

export function ProcessSteps() {
  return (
    <section className="py-24 bg-ivory-50">
      <div className="container-luxury">
        <div className="text-center mb-16">
          <p className="eyebrow text-champagne-700 mb-4">How It Works</p>
          <h2 className="font-display text-display-2 text-charcoal-900">The B'trix Experience</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="relative text-center"
            >
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ivory-100 border border-champagne-200 text-champagne-600">
                  <step.icon className="h-7 w-7" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-champagne-500 text-charcoal-900 text-xs font-medium">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-display text-xl text-charcoal-900 mb-2">{step.title}</h3>
              <p className="text-charcoal-500 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

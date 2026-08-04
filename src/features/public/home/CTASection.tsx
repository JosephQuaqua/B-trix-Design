import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function CTASection() {
  return (
    <section className="relative py-32 overflow-hidden bg-gradient-charcoal">
      <div className="absolute inset-0 opacity-5 bg-gradient-gold" />
      <div className="container-luxury relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow text-champagne-300 mb-6">Begin Your Journey</p>
          <h2 className="font-display text-display-1 text-ivory-50 leading-tight max-w-3xl mx-auto text-balance">
            Let's Create Something<br />Beautiful Together
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-ivory-300 text-lg leading-relaxed">
            Book a consultation today and take the first step toward your perfect dress.
          </p>
          <div className="mt-10">
            <Link to="/book-appointment">
              <Button variant="gold" size="lg" className="group">
                Book Your Appointment
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

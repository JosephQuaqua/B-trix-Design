import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SITE } from '@/config/site'

const heroImage = 'https://images.pexels.com/photos/28863325/pexels-photo-28863325.jpeg?auto=compress&cs=tinysrgb&w=1200'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Bride in elegant white wedding dress"
          className="absolute right-0 top-0 h-full w-full md:w-1/2 object-cover opacity-80 md:opacity-100"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ivory-50 via-ivory-50/90 to-transparent md:from-ivory-50 md:via-ivory-50/60 md:to-transparent" />
      </div>

      <div className="container-luxury relative z-10 pt-32 pb-20">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="eyebrow text-champagne-700 mb-6"
          >
            {SITE.tagline}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-display-1 text-charcoal-900 leading-[1.05] text-balance"
          >
            Where Elegance<br />Meets Craftsmanship
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-lg text-charcoal-600 leading-relaxed max-w-lg"
          >
            A luxury bridal fashion studio specializing in white wedding dresses, Liberian traditional wedding attire, and bespoke custom designs.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Link to="/book-appointment">
              <Button variant="gold" size="lg" className="group">
                Book a Consultation
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/collections">
              <Button variant="outline" size="lg">Explore Collections</Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-charcoal-400"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="h-12 w-px bg-gradient-to-b from-champagne-400 to-transparent" />
      </motion.div>
    </section>
  )
}

import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function BookingSuccessPage() {
  return (
    <section className="pt-32 pb-24 bg-gradient-hero min-h-screen flex items-center">
      <div className="container-luxury max-w-2xl text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-success-50 text-success-500 mb-8"
        >
          <Check className="h-10 w-10" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-display text-display-1 text-charcoal-900 mb-4"
        >
          Request Received
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-lg text-charcoal-500 mb-2"
        >
          Thank you for booking with B'trix Design.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-charcoal-500 mb-10"
        >
          Our team will review your request and send a confirmation email within 48 hours. You can track the status of your appointment in your dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/dashboard/appointments">
            <Button variant="gold" size="lg">View My Appointments</Button>
          </Link>
          <Link to="/">
            <Button variant="outline" size="lg">Return Home</Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

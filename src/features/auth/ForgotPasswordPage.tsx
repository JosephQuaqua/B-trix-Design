import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/context/AuthContext'

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await resetPassword(email)
    setLoading(false)
    if (error) {
      setError(error)
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
        <h1 className="font-display text-display-2 text-charcoal-900 mb-4">Check Your Email</h1>
        <p className="text-charcoal-500 mb-8">
          We've sent a password reset link to <strong className="text-charcoal-800">{email}</strong>.
          Follow the link in the email to reset your password.
        </p>
        <Link to="/login">
          <Button variant="gold">Back to Sign In</Button>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h1 className="font-display text-display-2 text-charcoal-900 mb-2">Forgot Password</h1>
      <p className="text-charcoal-500 mb-8">Enter your email and we'll send you a reset link.</p>

      {error && (
        <div className="mb-6 p-4 rounded-md bg-danger-50 border border-danger-500/30 text-danger-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <Button type="submit" variant="gold" size="lg" loading={loading} className="w-full">
          Send Reset Link
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-charcoal-500">
        Remember your password?{' '}
        <Link to="/login" className="text-champagne-600 hover:text-champagne-700 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </motion.div>
  )
}

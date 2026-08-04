import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError(error)
    } else {
      const from = (location.state as { from?: string })?.from ?? '/dashboard'
      navigate(from)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h1 className="font-display text-display-2 text-charcoal-900 mb-2">Welcome Back</h1>
      <p className="text-charcoal-500 mb-8">Sign in to manage your appointments and designs.</p>

      {error && (
        <div className="mb-6 p-4 rounded-md bg-danger-50 border border-danger-500/30 text-danger-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <Input
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <div className="mt-2 text-right">
            <Link to="/forgot-password" className="text-sm text-champagne-600 hover:text-champagne-700 transition-colors">
              Forgot password?
            </Link>
          </div>
        </div>
        <Button type="submit" variant="gold" size="lg" loading={loading} className="w-full">
          Sign In
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-charcoal-500">
        Don't have an account?{' '}
        <Link to="/register" className="text-champagne-600 hover:text-champagne-700 font-medium transition-colors">
          Create one
        </Link>
      </p>
    </motion.div>
  )
}

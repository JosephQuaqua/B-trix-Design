import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { SITE } from '@/config/site'

interface LogoProps {
  className?: string
  variant?: 'full' | 'mark'
  light?: boolean
}

export function Logo({ className, variant = 'full', light = false }: LogoProps) {
  return (
    <Link to="/" className={cn('inline-flex items-center gap-3 group', className)} aria-label={`${SITE.name} — Home`}>
      <span className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-charcoal-900 shadow-soft transition-transform group-hover:scale-105">
        <svg viewBox="0 0 40 40" className="h-7 w-7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E0C784" />
              <stop offset="50%" stopColor="#C29A3D" />
              <stop offset="100%" stopColor="#A87F32" />
            </linearGradient>
          </defs>
          <text x="20" y="28" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="22" fontWeight="600" textAnchor="middle" fill="url(#logo-grad)">B</text>
        </svg>
      </span>
      {variant === 'full' && (
        <span className={cn('font-display text-xl font-medium tracking-tight', light ? 'text-ivory-50' : 'text-charcoal-900')}>
          B'trix<span className="text-champagne-500"> Design</span>
        </span>
      )}
    </Link>
  )
}

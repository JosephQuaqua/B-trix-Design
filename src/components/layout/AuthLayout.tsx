import { Outlet, Link } from 'react-router-dom'
import { Logo } from './Logo'
import { SITE } from '@/config/site'

export function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-ivory-50">
      <div className="flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Logo />
          </div>
          <Outlet />
        </div>
      </div>
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-charcoal p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-gradient-gold" />
        <div className="relative text-center max-w-md">
          <p className="eyebrow text-champagne-300 mb-6">B'trix Design</p>
          <h1 className="font-display text-display-2 text-ivory-50 leading-tight">
            Where Elegance<br />Meets Craftsmanship
          </h1>
          <p className="mt-6 text-ivory-300 leading-relaxed text-lg">
            {SITE.description}
          </p>
          <p className="mt-8 font-display text-xl text-champagne-300 italic">
            "{SITE.tagline}"
          </p>
          <div className="mt-8">
            <Link to="/" className="text-champagne-400 hover:text-champagne-300 transition-colors text-sm link-underline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

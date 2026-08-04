import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Logo } from './Logo'
import { Button } from '@/components/ui/Button'
import { NAV_LINKS, SITE } from '@/config/site'
import { cn } from '@/lib/cn'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-luxury',
        scrolled ? 'bg-ivory-50/95 backdrop-blur-md shadow-soft border-b border-ivory-200' : 'bg-transparent',
      )}
    >
      <nav className="container-luxury flex items-center justify-between py-4">
        <Logo />

        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium tracking-wide transition-colors duration-200 link-underline',
                  isActive ? 'text-champagne-600' : 'text-charcoal-700 hover:text-charcoal-900',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:block">
          <Link to="/book-appointment">
            <Button variant="gold" size="sm">Book Appointment</Button>
          </Link>
        </div>

        <button
          className="lg:hidden text-charcoal-800 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-ivory-50 border-b border-ivory-200 overflow-hidden"
          >
            <div className="container-luxury py-6 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      'text-base font-medium py-2 border-b border-ivory-200',
                      isActive ? 'text-champagne-600' : 'text-charcoal-700',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Link to="/book-appointment" className="mt-2">
                <Button variant="gold" className="w-full">Book Appointment</Button>
              </Link>
              <p className="text-sm text-charcoal-500 text-center mt-2">{SITE.tagline}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

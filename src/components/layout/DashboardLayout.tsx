import { useState } from 'react'
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarDays, Heart, Ruler, MessageSquare, User, Settings,
  LayoutDashboard, LogOut, Menu, X, Bell,
} from 'lucide-react'
import { Logo } from './Logo'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/cn'

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/dashboard/favorites', label: 'Favorites', icon: Heart },
  { to: '/dashboard/measurements', label: 'Measurements', icon: Ruler },
  { to: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export function DashboardLayout() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-ivory-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-charcoal-900 text-ivory-100 fixed inset-y-0 left-0 z-30">
        <div className="p-6 border-b border-charcoal-700">
          <Logo light />
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-champagne-500/15 text-champagne-300 border-l-2 border-champagne-400'
                    : 'text-ivory-300 hover:bg-charcoal-800 hover:text-ivory-50',
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-charcoal-700">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-9 w-9 rounded-full bg-gradient-gold flex items-center justify-center text-charcoal-900 font-medium text-sm">
              {profile?.full_name?.[0]?.toUpperCase() ?? 'C'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ivory-50 truncate">{profile?.full_name ?? 'Customer'}</p>
              <p className="text-xs text-ivory-400 truncate">{profile?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="mt-2 flex items-center gap-3 px-4 py-2.5 w-full rounded-md text-sm text-ivory-300 hover:bg-charcoal-800 hover:text-danger-400 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-charcoal-900 text-ivory-50 px-4 py-3 flex items-center justify-between">
        <Logo light />
        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5 text-ivory-300" />
          <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-y-0 left-0 top-14 w-64 bg-charcoal-900 z-20 overflow-y-auto"
          >
            <nav className="px-4 py-6 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium',
                      isActive ? 'bg-champagne-500/15 text-champagne-300' : 'text-ivory-300 hover:bg-charcoal-800',
                    )
                  }
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              ))}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-3 w-full rounded-md text-sm text-ivory-300 hover:bg-charcoal-800"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 pt-14 lg:pt-0">
        <Outlet />
      </div>
    </div>
  )
}

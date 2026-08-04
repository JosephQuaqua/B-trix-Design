import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Image, FolderOpen, Briefcase, CalendarDays,
  Users, Star, MessageSquare, UserCog, BarChart3, Settings,
  ShieldCheck, Activity, Sliders, LogOut, Menu, X,
} from 'lucide-react'
import { Logo } from './Logo'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/cn'
import type { Role } from '@/config/routes'

const adminNav = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true, roles: ['admin','super_admin'] as Role[] },
  { to: '/admin/gallery', label: 'Gallery', icon: Image, roles: ['admin','super_admin'] as Role[] },
  { to: '/admin/collections', label: 'Collections', icon: FolderOpen, roles: ['admin','super_admin'] as Role[] },
  { to: '/admin/services', label: 'Services', icon: Briefcase, roles: ['admin','super_admin'] as Role[] },
  { to: '/admin/appointments', label: 'Appointments', icon: CalendarDays, roles: ['admin','super_admin'] as Role[] },
  { to: '/admin/customers', label: 'Customers', icon: Users, roles: ['admin','super_admin'] as Role[] },
  { to: '/admin/reviews', label: 'Reviews', icon: Star, roles: ['admin','super_admin'] as Role[] },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquare, roles: ['admin','super_admin'] as Role[] },
  { to: '/admin/staff', label: 'Staff', icon: UserCog, roles: ['admin','super_admin'] as Role[] },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3, roles: ['admin','super_admin'] as Role[] },
  { to: '/admin/settings', label: 'Settings', icon: Settings, roles: ['admin','super_admin'] as Role[] },
  { to: '/admin/roles', label: 'Roles', icon: ShieldCheck, roles: ['super_admin'] as Role[] },
  { to: '/admin/analytics', label: 'Analytics', icon: Activity, roles: ['super_admin'] as Role[] },
  { to: '/admin/audit-logs', label: 'Audit Logs', icon: FileText, roles: ['super_admin'] as Role[] },
  { to: '/admin/system-config', label: 'System Config', icon: Sliders, roles: ['super_admin'] as Role[] },
]

function FileText(props: { className?: string }) {
  return <svg className={props.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
}

export function AdminLayout() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const role = (profile?.role ?? 'admin') as Role

  const items = adminNav.filter((item) => item.roles.includes(role))

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-ivory-50 flex">
      <aside className="hidden lg:flex w-64 flex-col bg-charcoal-900 text-ivory-100 fixed inset-y-0 left-0 z-30">
        <div className="p-6 border-b border-charcoal-700">
          <Logo light />
          <p className="mt-2 text-xs text-champagne-400 uppercase tracking-widest">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-champagne-500/15 text-champagne-300'
                    : 'text-ivory-300 hover:bg-charcoal-800 hover:text-ivory-50',
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-charcoal-700">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-8 w-8 rounded-full bg-gradient-gold flex items-center justify-center text-charcoal-900 font-medium text-xs">
              {profile?.full_name?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ivory-50 truncate">{profile?.full_name ?? 'Admin'}</p>
              <p className="text-xs text-champagne-400 capitalize">{role.replace('_', ' ')}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="mt-2 flex items-center gap-3 px-4 py-2 w-full rounded-md text-sm text-ivory-300 hover:bg-charcoal-800 hover:text-danger-400 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-charcoal-900 text-ivory-50 px-4 py-3 flex items-center justify-between">
        <Logo light />
        <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-y-0 left-0 top-14 w-64 bg-charcoal-900 z-20 overflow-y-auto"
          >
            <nav className="px-3 py-4 space-y-0.5">
              {items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium',
                      isActive ? 'bg-champagne-500/15 text-champagne-300' : 'text-ivory-300 hover:bg-charcoal-800',
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-2.5 w-full rounded-md text-sm text-ivory-300 hover:bg-charcoal-800"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 lg:ml-64 pt-14 lg:pt-0">
        <Outlet />
      </div>
    </div>
  )
}

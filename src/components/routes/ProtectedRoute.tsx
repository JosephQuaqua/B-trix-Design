import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Spinner } from '@/components/ui/Spinner'
import type { Role } from '@/config/routes'

interface ProtectedRouteProps {
  allow: Role[]
}

export function ProtectedRoute({ allow }: ProtectedRouteProps) {
  const { profile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory-50">
        <Spinner size={32} />
      </div>
    )
  }

  if (!profile) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (!allow.includes(profile.role as Role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}

import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero px-4">
      <div className="text-center">
        <p className="eyebrow text-champagne-600 mb-4">Error 404</p>
        <h1 className="font-display text-display-1 text-charcoal-900 mb-4">Page Not Found</h1>
        <p className="max-w-md mx-auto text-charcoal-500 mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back to something beautiful.
        </p>
        <Link to="/">
          <Button variant="gold">Return Home</Button>
        </Link>
      </div>
    </div>
  )
}

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero px-4">
      <div className="text-center">
        <p className="eyebrow text-champagne-600 mb-4">Access Denied</p>
        <h1 className="font-display text-display-1 text-charcoal-900 mb-4">Unauthorized</h1>
        <p className="max-w-md mx-auto text-charcoal-500 mb-8">
          You don't have permission to view this page. Please contact an administrator if you believe this is an error.
        </p>
        <Link to="/">
          <Button variant="gold">Return Home</Button>
        </Link>
      </div>
    </div>
  )
}

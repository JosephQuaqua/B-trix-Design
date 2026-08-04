import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 text-charcoal-300">{icon}</div>}
      <h3 className="font-display text-xl text-charcoal-800">{title}</h3>
      {description && <p className="mt-2 max-w-md text-charcoal-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

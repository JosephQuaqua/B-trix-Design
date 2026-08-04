import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import { Loader2 } from 'lucide-react'

type Variant = 'primary' | 'gold' | 'outline' | 'ghost' | 'link'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-charcoal-900 text-ivory-50 hover:bg-charcoal-800 active:bg-charcoal-950',
  gold: 'bg-gradient-gold text-charcoal-900 hover:opacity-90 active:opacity-100 shadow-gold',
  outline: 'border border-charcoal-300 text-charcoal-800 hover:border-champagne-400 hover:text-champagne-700',
  ghost: 'text-charcoal-700 hover:bg-ivory-200 hover:text-charcoal-900',
  link: 'text-champagne-600 hover:text-champagne-700 underline-offset-4 hover:underline p-0',
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm px-4 py-2',
  md: 'text-base px-6 py-3',
  lg: 'text-lg px-8 py-4',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-all duration-300 ease-luxury disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          variant !== 'link' && 'shadow-soft hover:shadow-card',
          className,
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'

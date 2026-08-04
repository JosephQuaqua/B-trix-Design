import { cn } from '@/lib/cn'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-shimmer rounded-md bg-gradient-to-r from-ivory-200 via-ivory-100 to-ivory-200 bg-[length:200%_100%]',
        className,
      )}
    />
  )
}

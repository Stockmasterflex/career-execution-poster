import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'tier-1a' | 'tier-1b' | 'tier-2' | 'success' | 'warning' | 'error'
  children: React.ReactNode
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        {
          'bg-white/10 text-white border border-white/20': variant === 'default',
          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300': variant === 'tier-1a',
          'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300': variant === 'tier-1b',
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300': variant === 'tier-2',
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': variant === 'success',
          'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300': variant === 'warning',
          'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300': variant === 'error',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
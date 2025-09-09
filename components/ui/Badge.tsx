import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'phase-1' | 'phase-2' | 'phase-3' | 'phase-4'
  children: React.ReactNode
}

export function Badge({ children, variant = 'default', className, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-bg-surface text-text-primary',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    'phase-1': 'bg-orange-100 text-orange-800',
    'phase-2': 'bg-cyan-100 text-cyan-800',
    'phase-3': 'bg-green-100 text-green-800',
    'phase-4': 'bg-purple-100 text-purple-800',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

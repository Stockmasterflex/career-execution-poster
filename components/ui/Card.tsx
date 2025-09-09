import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'glass' | 'phase-1' | 'phase-2' | 'phase-3' | 'phase-4'
}

export function Card({ className, variant = 'default', children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border transition-all duration-200',
        {
          'bg-white/5 border-white/10 backdrop-blur-sm': variant === 'glass',
          'bg-white/10 border-white/20 backdrop-blur-sm': variant === 'default',
          'bg-gradient-to-br from-phase-1-500/20 to-phase-1-700/20 border-phase-1-500/30 backdrop-blur-sm': variant === 'phase-1',
          'bg-gradient-to-br from-phase-2-500/20 to-phase-2-700/20 border-phase-2-500/30 backdrop-blur-sm': variant === 'phase-2',
          'bg-gradient-to-br from-phase-3-500/20 to-phase-3-700/20 border-phase-3-500/30 backdrop-blur-sm': variant === 'phase-3',
          'bg-gradient-to-br from-phase-4-500/20 to-phase-4-700/20 border-phase-4-500/30 backdrop-blur-sm': variant === 'phase-4',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 pb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-lg font-semibold text-white', className)} {...props}>
      {children}
    </h3>
  )
}
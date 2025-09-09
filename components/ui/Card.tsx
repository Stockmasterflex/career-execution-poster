import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'glass' | 'phase-1' | 'phase-2' | 'phase-3' | 'phase-4'
}

export function Card({ children, variant = 'default', className, ...props }: CardProps) {
  const variants = {
    default: 'bg-white border border-gray-200 shadow-sm',
    glass: 'glass-card',
    'phase-1': 'glass-card border-l-4 border-l-phase-1',
    'phase-2': 'glass-card border-l-4 border-l-phase-2', 
    'phase-3': 'glass-card border-l-4 border-l-phase-3',
    'phase-4': 'glass-card border-l-4 border-l-phase-4',
  }

  return (
    <div
      className={cn(
        'rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-lg font-semibold text-text-primary', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('text-text-secondary', className)} {...props}>
      {children}
    </div>
  )
}

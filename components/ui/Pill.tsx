'use client'

import { cn } from '@/lib/utils'

interface PillProps {
  children: React.ReactNode
  variant?: 'default' | 'phase1' | 'phase2' | 'phase3' | 'phase4' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Pill({ 
  children, 
  variant = 'default', 
  size = 'md',
  className 
}: PillProps) {
  const baseClasses = 'inline-flex items-center font-medium rounded-full'
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    phase1: 'bg-orange-100 text-orange-800',
    phase2: 'bg-cyan-100 text-cyan-800',
    phase3: 'bg-emerald-100 text-emerald-800',
    phase4: 'bg-purple-100 text-purple-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800'
  }
  
  return (
    <span
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

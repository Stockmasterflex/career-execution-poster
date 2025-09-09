import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'white' | 'phase-1' | 'phase-2' | 'phase-3' | 'phase-4'
  className?: string
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'primary', 
  className 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const colorClasses = {
    primary: 'text-blue-500',
    white: 'text-white',
    'phase-1': 'text-orange-500',
    'phase-2': 'text-cyan-500',
    'phase-3': 'text-green-500',
    'phase-4': 'text-purple-500'
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-current',
          sizeClasses[size],
          colorClasses[color]
        )}
      />
    </div>
  )
}

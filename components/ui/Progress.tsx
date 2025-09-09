import React from 'react'
import { cn } from '@/lib/utils'

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  variant?: 'default' | 'phase-1' | 'phase-2' | 'phase-3' | 'phase-4'
  size?: 'sm' | 'md' | 'lg'
}

export function Progress({ 
  className, 
  value, 
  max = 100, 
  variant = 'default', 
  size = 'md',
  ...props 
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  return (
    <div
      className={cn(
        'w-full bg-white/10 rounded-full overflow-hidden',
        {
          'h-2': size === 'sm',
          'h-3': size === 'md',
          'h-4': size === 'lg',
        },
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'h-full transition-all duration-300 ease-out',
          {
            'bg-gradient-to-r from-white/20 to-white/40': variant === 'default',
            'bg-gradient-to-r from-phase-1-500 to-phase-1-600': variant === 'phase-1',
            'bg-gradient-to-r from-phase-2-500 to-phase-2-600': variant === 'phase-2',
            'bg-gradient-to-r from-phase-3-500 to-phase-3-600': variant === 'phase-3',
            'bg-gradient-to-r from-phase-4-500 to-phase-4-600': variant === 'phase-4',
          }
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}
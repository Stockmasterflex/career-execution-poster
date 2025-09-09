import React from 'react'
import { cn } from '@/lib/utils'

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  showValue?: boolean
  variant?: 'default' | 'success' | 'warning' | 'error'
}

export function Progress({ 
  value, 
  max = 100, 
  showValue = false, 
  variant = 'default',
  className, 
  ...props 
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const variants = {
    default: 'bg-gradient-dashboard',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
  }

  return (
    <div className={cn('space-y-1', className)} {...props}>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={cn(
            'h-2 rounded-full transition-all duration-300 ease-in-out',
            variants[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <div className="text-sm text-text-secondary text-center">
          {value}/{max} ({Math.round(percentage)}%)
        </div>
      )}
    </div>
  )
}

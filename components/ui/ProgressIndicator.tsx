import React from 'react'
import { cn } from '@/lib/utils'

interface ProgressIndicatorProps {
  current: number
  total: number
  size?: 'sm' | 'md' | 'lg'
  showPercentage?: boolean
  color?: 'primary' | 'phase-1' | 'phase-2' | 'phase-3' | 'phase-4'
  className?: string
}

export function ProgressIndicator({
  current,
  total,
  size = 'md',
  showPercentage = true,
  color = 'primary',
  className
}: ProgressIndicatorProps) {
  const percentage = Math.min((current / total) * 100, 100)
  const isComplete = current >= total

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  }

  const colorClasses = {
    primary: 'bg-blue-500',
    'phase-1': 'bg-orange-500',
    'phase-2': 'bg-cyan-500',
    'phase-3': 'bg-green-500',
    'phase-4': 'bg-purple-500'
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Progress
        </span>
        {showPercentage && (
          <span className="text-sm text-gray-500">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      
      <div className={cn(
        'w-full bg-gray-200 rounded-full overflow-hidden',
        sizeClasses[size]
      )}>
        <div
          className={cn(
            'h-full transition-all duration-300 ease-in-out',
            colorClasses[color],
            isComplete && 'bg-green-500'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-gray-500">
          {current} of {total}
        </span>
        {isComplete && (
          <span className="text-xs text-green-600 font-medium">
            Complete!
          </span>
        )}
      </div>
    </div>
  )
}

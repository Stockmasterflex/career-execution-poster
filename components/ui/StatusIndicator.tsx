import React from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle, XCircle, AlertCircle, Clock, Pause } from 'lucide-react'

interface StatusIndicatorProps {
  status: 'completed' | 'in-progress' | 'pending' | 'paused' | 'error'
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export function StatusIndicator({
  status,
  size = 'md',
  showText = false,
  className
}: StatusIndicatorProps) {
  const icons = {
    completed: CheckCircle,
    'in-progress': Clock,
    pending: Clock,
    paused: Pause,
    error: XCircle
  }

  const colors = {
    completed: 'text-green-500',
    'in-progress': 'text-blue-500',
    pending: 'text-gray-400',
    paused: 'text-yellow-500',
    error: 'text-red-500'
  }

  const textLabels = {
    completed: 'Completed',
    'in-progress': 'In Progress',
    pending: 'Pending',
    paused: 'Paused',
    error: 'Error'
  }

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const Icon = icons[status]

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Icon className={cn(
        sizeClasses[size],
        colors[status]
      )} />
      {showText && (
        <span className={cn(
          'text-sm font-medium',
          colors[status]
        )}>
          {textLabels[status]}
        </span>
      )}
    </div>
  )
}

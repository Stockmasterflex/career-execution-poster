'use client'

import { cn } from '@/lib/utils'

interface ProgressBarProps {
  current: number
  target: number
  label: string
  className?: string
  showValues?: boolean
}

export default function ProgressBar({ 
  current, 
  target, 
  label, 
  className,
  showValues = true 
}: ProgressBarProps) {
  const percentage = Math.min((current / target) * 100, 100)
  
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {showValues && (
          <span className="text-sm text-gray-500">
            {current}/{target}
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

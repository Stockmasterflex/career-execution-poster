import React from 'react'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  title: string
  current: number
  target: number
  phase: number
  className?: string
  onUpdate?: (value: number) => void
}

export function KpiCard({ title, current, target, phase, className, onUpdate }: KpiCardProps) {
  const percentage = Math.min((current / target) * 100, 100)
  const isComplete = current >= target

  const phaseColors = {
    1: 'bg-phase-1',
    2: 'bg-phase-2', 
    3: 'bg-phase-3',
    4: 'bg-phase-4',
  } as const

  const progressColors = {
    1: 'bg-purple-500',
    2: 'bg-blue-500', 
    3: 'bg-green-500',
    4: 'bg-purple-500',
  } as const

  return (
    <div className={cn('kpi-card', className)}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-8 h-8 ${phaseColors[phase as keyof typeof phaseColors] || 'bg-gray-500'} rounded-lg flex items-center justify-center text-white`}>
          <span className="text-xs font-bold">{phase}</span>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-text-primary">{title}</p>
          <p className="text-xs text-text-secondary">{current}/{target}</p>
        </div>
      </div>
      
      <div className="progress-bar">
        <div 
          className={`progress-fill ${progressColors[phase as keyof typeof progressColors] || 'bg-gray-500'}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}

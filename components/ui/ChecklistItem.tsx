import React from 'react'
import { Checkbox } from './Checkbox'
import { Badge } from './Badge'
import { cn } from '@/lib/utils'

interface ChecklistItemProps {
  id: string
  item: string
  completed: boolean
  streak?: number
  onToggle: (id: string, completed: boolean) => void
  className?: string
}

export function ChecklistItem({ 
  id, 
  item, 
  completed, 
  streak = 0, 
  onToggle, 
  className 
}: ChecklistItemProps) {
  return (
    <div className={cn('flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors', className)}>
      <div className="flex-1">
        <Checkbox
          id={id}
          label={item}
          checked={completed}
          onChange={(e) => onToggle(id, e.target.checked)}
          className="text-sm"
        />
      </div>
      {streak > 0 && (
        <Badge variant="success" className="ml-3">
          {streak} day{streak !== 1 ? 's' : ''}
        </Badge>
      )}
    </div>
  )
}

import React from 'react'
import { Badge } from './Badge'
import { cn } from '@/lib/utils'

interface CompanyRowProps {
  name: string
  tier: 'T1A' | 'T1B' | 'T2'
  status: 'lead' | 'applied' | 'interview' | 'offer' | 'rejected'
  notes?: string
  className?: string
}

export function CompanyRow({ name, tier, status, notes, className }: CompanyRowProps) {
  const statusVariants = {
    lead: 'default',
    applied: 'info',
    interview: 'warning',
    offer: 'success',
    rejected: 'error',
  } as const

  const tierColors = {
    T1A: 'bg-red-100 text-red-800',
    T1B: 'bg-yellow-100 text-yellow-800', 
    T2: 'bg-gray-100 text-gray-800',
  }

  return (
    <div className={cn('flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors', className)}>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">{name}</span>
          <span className={cn('px-2 py-1 rounded-full text-xs font-medium', tierColors[tier])}>
            {tier}
          </span>
        </div>
        {notes && (
          <p className="text-sm text-gray-500 mt-1">{notes}</p>
        )}
      </div>
      <Badge variant={statusVariants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    </div>
  )
}

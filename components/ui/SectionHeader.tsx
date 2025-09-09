import React from 'react'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  icon?: React.ReactNode
  title: string
  badge?: React.ReactNode
  className?: string
}

export function SectionHeader({ icon, title, badge, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center gap-4 pb-4 border-b-3 border-gray-200 relative', className)}>
      {icon && (
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
          {icon}
        </div>
      )}
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      {badge && (
        <div className="ml-auto">
          {badge}
        </div>
      )}
      <div className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
    </div>
  )
}

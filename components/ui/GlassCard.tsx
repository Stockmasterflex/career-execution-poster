'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export default function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <div
      className={cn(
        'bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-glass',
        hover && 'hover:shadow-card-lg hover:bg-white/90 transition-all duration-200',
        className
      )}
    >
      {children}
    </div>
  )
}

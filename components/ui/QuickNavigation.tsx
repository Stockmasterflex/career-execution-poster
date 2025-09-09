'use client'

import Link from 'next/link'
import { Calendar, Target, Zap, CheckCircle, Star, BarChart3 } from 'lucide-react'

export default function QuickNavigation() {
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3, color: 'text-blue-500' },
    { href: '/phase-1', label: 'P1', icon: Target, color: 'text-orange-500' },
    { href: '/phase-2', label: 'P2', icon: Zap, color: 'text-cyan-500' },
    { href: '/phase-3', label: 'P3', icon: CheckCircle, color: 'text-emerald-500' },
    { href: '/phase-4', label: 'P4', icon: Star, color: 'text-purple-500' },
    { href: '/calendar', label: 'Calendar', icon: Calendar, color: 'text-indigo-500' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Icon className={`w-5 h-5 ${item.color}`} />
                <span className="text-xs font-medium text-gray-700">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

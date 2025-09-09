'use client'

import { format } from 'date-fns'
import { LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'

interface HeaderProps {
  title: string
  phase?: 1 | 2 | 3 | 4
  onSignOut?: () => void
}

export default function Header({ title, phase, onSignOut }: HeaderProps) {
  const [currentDate, setCurrentDate] = useState('')
  
  useEffect(() => {
    const updateDate = () => {
      setCurrentDate(format(new Date(), 'EEEE, MMMM do'))
    }
    updateDate()
    const interval = setInterval(updateDate, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const getPhaseGradient = () => {
    switch (phase) {
      case 1: return 'bg-gradient-phase-1'
      case 2: return 'bg-gradient-phase-2'
      case 3: return 'bg-gradient-phase-3'
      case 4: return 'bg-gradient-phase-4'
      default: return 'bg-gradient-dashboard'
    }
  }

  return (
    <header className={`${getPhaseGradient()} text-white px-6 py-4 shadow-lg`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">{currentDate}</span>
          {onSignOut && (
            <button
              onClick={onSignOut}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

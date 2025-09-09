'use client'

import GlassCard from '@/components/ui/GlassCard'
import Pill from '@/components/ui/Pill'

export default function CareerPhases() {
  const phases = [
    {
      number: 1,
      title: 'Foundation',
      status: 'Current',
      startDate: 'Jan 2024',
      endDate: 'Mar 2024',
      gradient: 'bg-gradient-phase-1'
    },
    {
      number: 2,
      title: 'Network',
      status: 'Upcoming',
      startDate: 'Apr 2024',
      endDate: 'Jun 2024',
      gradient: 'bg-gradient-phase-2'
    },
    {
      number: 3,
      title: 'Apply',
      status: 'Upcoming',
      startDate: 'Jul 2024',
      endDate: 'Sep 2024',
      gradient: 'bg-gradient-phase-3'
    },
    {
      number: 4,
      title: 'Land',
      status: 'Upcoming',
      startDate: 'Oct 2024',
      endDate: 'Dec 2024',
      gradient: 'bg-gradient-phase-4'
    }
  ]

  return (
    <GlassCard className="p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Career Phases</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {phases.map(phase => (
          <div
            key={phase.number}
            className={`${phase.gradient} text-white p-4 rounded-lg text-center`}
          >
            <div className="text-2xl font-bold mb-1">P{phase.number}</div>
            <div className="text-sm font-medium mb-2">{phase.title}</div>
            <div className="text-xs opacity-90 mb-2">
              {phase.startDate} - {phase.endDate}
            </div>
            <Pill 
              variant={phase.status === 'Current' ? 'success' : 'default'}
              size="sm"
              className="bg-white/20 text-white border-white/30"
            >
              {phase.status}
            </Pill>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

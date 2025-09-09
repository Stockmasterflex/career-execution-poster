'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { ArrowRight } from 'lucide-react'

const phases = [
  {
    number: 1,
    title: 'Foundation & Immediate Market Entry',
    period: 'Sept – Dec 2025',
    gradient: 'phase-gradient-1',
    description: 'Certifications, Brand, Networking'
  },
  {
    number: 2,
    title: 'Interview Intensification & Job Closing',
    period: 'Jan – Mar 2026',
    gradient: 'phase-gradient-2',
    description: 'Pipeline Mgmt, Salary Negotiation'
  },
  {
    number: 3,
    title: 'Performance & Rapid Advancement',
    period: 'Mar 2026 – Dec 2027',
    gradient: 'phase-gradient-3',
    description: 'Career Performance, Compensation Growth'
  },
  {
    number: 4,
    title: 'Elite Status & Wealth Building',
    period: '2028+',
    gradient: 'phase-gradient-4',
    description: 'CMT Charter, $150K+ Comp'
  }
]

export function PhaseNavigation() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {phases.map((phase) => (
        <Link key={phase.number} href={`/phase-${phase.number}`}>
          <Card className={`${phase.gradient} hover:scale-105 transition-transform cursor-pointer`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{phase.number}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-white/60" />
              </div>
              <h3 className="font-semibold text-white mb-1">
                Phase {phase.number}
              </h3>
              <p className="text-xs text-white/80 mb-2">
                {phase.period}
              </p>
              <p className="text-sm text-white/90 font-medium">
                {phase.title}
              </p>
              <p className="text-xs text-white/70 mt-2">
                {phase.description}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
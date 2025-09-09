'use client'

import { useEffect } from 'react'
import Header from '@/components/ui/Header'
import QuickNavigation from '@/components/ui/QuickNavigation'
import TodayFocus from '@/components/dashboard/TodayFocus'
import DailyNonNegotiables from '@/components/dashboard/DailyNonNegotiables'
import StatusBand from '@/components/dashboard/StatusBand'
import WeeklySchedule from '@/components/dashboard/WeeklySchedule'
import CurrentStatus from '@/components/dashboard/CurrentStatus'
import CareerPhases from '@/components/dashboard/CareerPhases'
import Companies from '@/components/dashboard/Companies'
import KpiTracker from '@/components/dashboard/KpiTracker'
import { seedUserData } from '@/src/lib/seedUser'

export default function Dashboard() {
  useEffect(() => {
    seedUserData()
  }, [])

  return (
    <div className="app-bg min-h-screen">
      <Header title="Career OS Dashboard" />
      
      <main className="max-w-7xl mx-auto px-6 py-8 pb-20">
        <div className="space-y-6">
          {/* 1. Today's Focus */}
          <TodayFocus />
          
          {/* 2. Daily Non-Negotiables */}
          <DailyNonNegotiables />
          
          {/* 3. Status Band */}
          <StatusBand />
          
          {/* 4. Weekly Execution Schedule */}
          <WeeklySchedule />
          
          {/* 5. Current Status */}
          <CurrentStatus />
          
          {/* 6. Career Phases */}
          <CareerPhases />
          
          {/* 7. Target Companies */}
          <Companies />
          
          {/* 8. Phase 1 KPI Progress */}
          <KpiTracker />
        </div>
      </main>
      
      <QuickNavigation />
    </div>
  )
}
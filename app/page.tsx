import { Suspense } from 'react'
import { DashboardGate } from '@/components/DashboardGate'
import { Dashboard } from '@/components/Dashboard'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-white text-xl">Loading Career OS...</div>
    </div>}>
      <DashboardGate>
        <Dashboard />
      </DashboardGate>
    </Suspense>
  )
}
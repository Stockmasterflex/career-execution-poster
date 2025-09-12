'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ensureBootstrap } from '@/lib/ensureBootstrap'
import DailyNonNegotiables from '@/components/nonnegotiables/DailyNonNegotiables'
import WeeklySchedule from '@/components/schedule/WeeklySchedule'

interface DashboardClientProps {
  userId: string
  userEmail: string | undefined
}

export default function DashboardClient({ userId, userEmail }: DashboardClientProps) {
  const [bootstrapCompleted, setBootstrapCompleted] = useState(false)
  const [bootstrapLoading, setBootstrapLoading] = useState(true)

  const runBootstrap = async () => {
    try {
      console.log('[DASHBOARD] Running bootstrap...')
      setBootstrapLoading(true)
      const result = await ensureBootstrap(supabase)
      console.log('[DASHBOARD] Bootstrap result:', result)
      setBootstrapCompleted(result.seeded)
    } catch (error) {
      console.error('[DASHBOARD] Error running bootstrap:', error)
    } finally {
      setBootstrapLoading(false)
    }
  }

  useEffect(() => {
    // Run bootstrap once on mount
    runBootstrap()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (bootstrapLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{userEmail}</span>
              <button
                onClick={handleSignOut}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Daily Non-Negotiables Section */}
          <section>
            <DailyNonNegotiables userId={userId} />
          </section>

          {/* Weekly Schedule Section */}
          <section>
            <WeeklySchedule userId={userId} />
          </section>
        </div>
      </main>
    </div>
  )
}
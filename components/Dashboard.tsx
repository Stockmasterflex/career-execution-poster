'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { DailyNonNegotiables } from '@/components/DailyNonNegotiables'
import { KPIsStrip } from '@/components/KPIsStrip'
import { TargetCompanies } from '@/components/TargetCompanies'
import { PhaseNavigation } from '@/components/PhaseNavigation'
import { LogoutButton } from '@/components/LogoutButton'
import { format } from 'date-fns'

export function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [todayFocus, setTodayFocus] = useState('')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Career OS</h1>
            <p className="text-white/80 text-sm">
              {format(new Date(), 'EEEE, MMMM do, yyyy')}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white/80 text-sm">{user?.email}</span>
            <LogoutButton onSignOut={handleSignOut} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Today's Focus */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Today's Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="What are your top priorities today?"
              value={todayFocus}
              onChange={(e) => setTodayFocus(e.target.value)}
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>

        {/* Daily Non-Negotiables */}
        <DailyNonNegotiables />

        {/* Phase 1 KPI Strip */}
        <KPIsStrip phase={1} />

        {/* Target Companies */}
        <TargetCompanies />

        {/* Phase Navigation */}
        <PhaseNavigation />
      </main>
    </div>
  )
}
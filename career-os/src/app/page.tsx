'use client'

import { useAuth } from '@/contexts/AuthContext'
import LoginForm from '@/components/auth/LoginForm'
import Header from '@/components/layout/Header'
import KPICard from '@/components/kpis/KPICard'
import WeeklySchedule from '@/components/schedule/WeeklySchedule'
import DailyNonNegotiables from '@/components/nonnegotiables/DailyNonNegotiables'
import CompaniesList from '@/components/companies/CompaniesList'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase-browser'
import type { Database } from '@/lib/database.types'

type KPI = Database['public']['Tables']['kpis']['Row']

const DEFAULT_KPIS = [
  { name: 'CMT Study Progress', current_value: 16, target_value: 100, phase: 1 },
  { name: 'Networking DMs', current_value: 3, target_value: 40, phase: 1 },
  { name: 'Coffee Chats', current_value: 1, target_value: 8, phase: 1 },
  { name: 'Applications Sent', current_value: 3, target_value: 50, phase: 1 },
  { name: 'LinkedIn Posts', current_value: 7, target_value: 40, phase: 1 },
  { name: 'Website Build', current_value: 25, target_value: 100, phase: 1 },
]

export default function Dashboard() {
  const { user, loading } = useAuth()
  const [kpis, setKpis] = useState<KPI[]>([])
  const [kpisLoading, setKpisLoading] = useState(true)
  const supabase = createClient()

  const loadKPIs = useCallback(async () => {
    try {
      setKpisLoading(true)
      const { data, error } = await supabase
        .from('kpis')
        .select('*')
        .eq('user_id', user?.id || '')
        .order('created_at')

      if (error) throw error

      if (data && data.length > 0) {
        setKpis(data)
      } else {
        // Seed default KPIs if none exist
        await seedDefaultKPIs()
      }
    } catch (error) {
      console.error('Error loading KPIs:', error)
    } finally {
      setKpisLoading(false)
    }
  }, [user?.id, supabase])

  const seedDefaultKPIs = useCallback(async () => {
    try {
      const kpiData = DEFAULT_KPIS.map(kpi => ({
        user_id: user?.id || '',
        name: kpi.name,
        current_value: kpi.current_value,
        target_value: kpi.target_value,
        phase: kpi.phase,
      }))

      const { error } = await supabase
        .from('kpis')
        .insert(kpiData)

      if (error) throw error
      await loadKPIs()
    } catch (error) {
      console.error('Error seeding default KPIs:', error)
    }
  }, [user?.id, supabase, loadKPIs])

  useEffect(() => {
    if (user) {
      loadKPIs()
    }
  }, [user, loadKPIs])

  const updateKPI = async (id: string, currentValue: number, targetValue: number) => {
    try {
      const { error } = await supabase
        .from('kpis')
        .update({
          current_value: currentValue,
          target_value: targetValue,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error
      await loadKPIs()
    } catch (error) {
      console.error('Error updating KPI:', error)
      throw error
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to Career OS
          </h1>
          <p className="text-xl text-gray-300">
            Your comprehensive career development platform
          </p>
        </div>

        {/* KPI Cards */}
        <div className="mb-8">
          <h2 className="text-section-title font-semibold text-white mb-6">Phase 1 KPIs</h2>
          {kpisLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card-bg backdrop-blur-glass border border-border rounded-glass p-4 shadow-card animate-pulse">
                  <div className="h-6 bg-gray-700 rounded mb-3"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-2 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {kpis.map((kpi) => (
                <KPICard
                  key={kpi.id}
                  id={kpi.id}
                  name={kpi.name}
                  currentValue={kpi.current_value}
                  targetValue={kpi.target_value}
                  phase={kpi.phase}
                  onUpdate={updateKPI}
                />
              ))}
            </div>
          )}
        </div>

        {/* Weekly Schedule */}
        <div className="mb-8">
          <WeeklySchedule userId={user.id} />
        </div>

        {/* Daily Non-Negotiables */}
        <div className="mb-8">
          <DailyNonNegotiables userId={user.id} />
        </div>

        {/* Companies */}
        <div className="mb-8">
          <CompaniesList userId={user.id} />
        </div>
      </main>
    </div>
  )
}
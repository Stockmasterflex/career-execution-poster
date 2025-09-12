'use client'

import { useAuth } from '@/contexts/AuthContext'
import { redirect } from 'next/navigation'
import WeeklySchedule from '@/components/schedule/WeeklySchedule'
import KPICard from '@/components/kpis/KPICard'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import type { Database } from '@/lib/database.types'

type KPI = Database['public']['Tables']['kpis']['Row']

export default function Phase1Page() {
  const { user, loading } = useAuth()
  const [kpis, setKpis] = useState<KPI[]>([])
  const [kpisLoading, setKpisLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      loadKPIs()
    } else if (!loading) {
      redirect('/')
    }
  }, [user, loading])

  const loadKPIs = async () => {
    try {
      setKpisLoading(true)
      const { data, error } = await supabase
        .from('kpis')
        .select('*')
        .eq('user_id', user?.id || '')
        .eq('phase', 1)
        .order('created_at')

      if (error) throw error
      setKpis(data || [])
    } catch (error) {
      console.error('Error loading KPIs:', error)
    } finally {
      setKpisLoading(false)
    }
  }

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

  if (loading || kpisLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Phase 1: Foundation Building
          </h1>
          <p className="text-xl text-gray-300">
            Focus on core skills, networking, and market presence
          </p>
        </div>

        {/* KPI Cards */}
        <div className="mb-8">
          <h2 className="text-section-title font-semibold text-white mb-6">Phase 1 KPIs</h2>
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
        </div>

        {/* Weekly Schedule */}
        <div className="mb-8">
          <WeeklySchedule userId={user.id} />
        </div>
      </div>
    </div>
  )
}
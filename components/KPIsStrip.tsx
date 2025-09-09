'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { Card, CardContent } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'
import { Input } from '@/components/ui/Input'

interface KPI {
  id: string
  label: string
  target: number
  current: number
  unit: string
}

interface KPIsStripProps {
  phase: number
}

export function KPIsStrip({ phase }: KPIsStripProps) {
  const [kpis, setKpis] = useState<KPI[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadKPIs()
  }, [phase])

  const loadKPIs = async () => {
    try {
      const { data, error } = await supabase
        .from('kpis')
        .select('*')
        .eq('phase', phase)
        .order('label')

      if (error) throw error
      setKpis(data || [])
    } catch (error) {
      console.error('Error loading KPIs:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateKPI = async (id: string, current: number) => {
    try {
      const { error } = await supabase
        .from('kpis')
        .update({ current })
        .eq('id', id)

      if (error) throw error

      setKpis(prev => 
        prev.map(kpi => 
          kpi.id === id ? { ...kpi, current } : kpi
        )
      )
    } catch (error) {
      console.error('Error updating KPI:', error)
    }
  }

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="text-white/60">Loading KPIs...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Phase {phase} KPIs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((kpi) => {
            const percentage = kpi.target > 0 ? (kpi.current / kpi.target) * 100 : 0
            
            return (
              <div key={kpi.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white/80">{kpi.label}</span>
                  <span className="text-xs text-white/60">
                    {kpi.current}{kpi.unit} / {kpi.target}{kpi.unit}
                  </span>
                </div>
                <Progress 
                  value={percentage} 
                  variant={`phase-${phase}` as any}
                  className="mb-2"
                />
                <Input
                  type="number"
                  value={kpi.current}
                  onChange={(e) => updateKPI(kpi.id, parseFloat(e.target.value) || 0)}
                  className="h-8 text-sm"
                  placeholder="Current value"
                />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
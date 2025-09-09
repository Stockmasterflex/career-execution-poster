'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface PhasePageProps {
  phase: number
}

const phaseData = {
  1: {
    title: 'Foundation & Immediate Market Entry',
    period: 'Sept – Dec 2025',
    gradient: 'phase-gradient-1',
    color: 'phase-1'
  },
  2: {
    title: 'Interview Intensification & Job Closing',
    period: 'Jan – Mar 2026',
    gradient: 'phase-gradient-2',
    color: 'phase-2'
  },
  3: {
    title: 'Performance & Rapid Advancement',
    period: 'Mar 2026 – Dec 2027',
    gradient: 'phase-gradient-3',
    color: 'phase-3'
  },
  4: {
    title: 'Elite Status & Wealth Building',
    period: '2028+',
    gradient: 'phase-gradient-4',
    color: 'phase-4'
  }
}

export function PhasePage({ phase }: PhasePageProps) {
  const [planData, setPlanData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadPlanData()
  }, [])

  const loadPlanData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('user_plans')
        .select('plan_data')
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      setPlanData(data?.plan_data)
    } catch (error) {
      console.error('Error loading plan data:', error)
    } finally {
      setLoading(false)
    }
  }

  const currentPhase = phaseData[phase as keyof typeof phaseData]
  const phaseInfo = planData?.phases?.[phase - 1]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading phase {phase}...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className={`${currentPhase.gradient} p-4 shadow-lg`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Phase {phase}</h1>
            <h2 className="text-xl text-white/90">{currentPhase.title}</h2>
            <p className="text-white/80">{currentPhase.period}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Phase Pillars */}
        {phaseInfo?.pillars && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {phaseInfo.pillars.map((pillar: any, index: number) => (
              <Card key={index} variant={`phase-${phase}` as any}>
                <CardHeader>
                  <CardTitle className="text-white">{pillar.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {pillar.items.map((item: string, itemIndex: number) => (
                      <li key={itemIndex} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-white/60 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-white/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* KPIs */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Phase {phase} KPIs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {planData?.kpiTracker?.map((kpi: any, index: number) => {
                const percentage = kpi.goal > 0 ? (kpi.current / kpi.goal) * 100 : 0
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white/80">{kpi.title}</span>
                      <span className="text-xs text-white/60">
                        {kpi.current}{kpi.unit} / {kpi.goal}{kpi.unit}
                      </span>
                    </div>
                    <Progress 
                      value={percentage} 
                      variant={`phase-${phase}` as any}
                    />
                    <div className="text-xs text-white/60">
                      Target: {kpi.weeklyTarget}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Success Metrics */}
        {planData?.phases?.[phase - 1]?.pillars && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Success Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {planData.phases[phase - 1].pillars.map((pillar: any, index: number) => (
                  <div key={index} className="p-4 bg-white/5 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">{pillar.title}</h4>
                    <ul className="space-y-1">
                      {pillar.items.map((item: string, itemIndex: number) => (
                        <li key={itemIndex} className="text-sm text-white/80 flex items-start space-x-2">
                          <span className="text-white/40">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes Section */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Phase {phase} Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={`Add your notes and insights for Phase ${phase}...`}
              className="min-h-[200px]"
            />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
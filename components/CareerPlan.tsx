'use client'

import { useState, useEffect } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'

const defaultPlanData = {
  meta: {
    title: "Career Execution Plan",
    subtitle: "Your personal career execution guide",
    badges: [
      "💰 Target: $120K–200K+ by 2028",
      "📍 Bay Area Advantage",
      "⏰ Job by Feb 2026",
      "🎯 6–8 Month Runway",
      "📚 CMT Charter Path",
      "🤖 AI + Technical Edge"
    ],
    todayFocus: {
      "Mon": "Plan week • Target research • Market prep • Networking outreach",
      "Tue": "Deep CMT • Market analysis • Applications",
      "Wed": "Networking (coffee chats, DMs) • LinkedIn engagement",
      "Thu": "Content creation • Skill development • Interview prep",
      "Fri": "Week review • Metrics • Follow-ups",
      "Sat": "Major CMT study • Legend Room dev / long-form",
      "Sun": "Strategic planning • Market outlook • Family + reset"
    }
  },
  current: [
    "Starting Point: Unemployed, 6–8 month runway, SIE exam Sept 6, 2025",
    "Location Advantage: Alameda / SF Bay Area (FinTech + Traditional Finance hub)",
    "Unique Edge: Technical analysis experience + AI trading projects + Minervini training",
    "Target Outcome: $120K–200K+ Technical Analyst by 2028"
  ],
  phases: [
    {
      name: "Phase 1: Foundation & Immediate Market Entry",
      dates: "Sept – Dec 2025",
      pillars: [
        {
          title: "🎓 Certifications & Skills",
          items: [
            "✅ Passed SIE (Sept 6)",
            "✅ Registered CMT Level I → Dec exam",
            "Study: 15–20 hrs/week",
            "Daily trade journal with R:R",
            "Legend Room AI documentation",
            "GitHub portfolio ready"
          ]
        }
      ]
    }
  ],
  kpis: {
    applications: {
      title: "Applications",
      metrics: [
        { name: "Applications Sent", current: 0, target: 50 },
        { name: "Interviews Scheduled", current: 0, target: 10 }
      ]
    },
    networking: {
      title: "Networking",
      metrics: [
        { name: "Coffee Chats", current: 0, target: 20 },
        { name: "LinkedIn Connections", current: 0, target: 100 }
      ]
    }
  }
}

interface CareerPlanProps {
  userData: any
  onSave: (data: any) => void
}

export default function CareerPlan({ userData, onSave }: CareerPlanProps) {
  const [plan, setPlan] = useState(defaultPlanData)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [supabaseData, setSupabaseData] = useState({
    kpis: [],
    companies: [],
    dailyNonNegotiables: [],
    scheduleBlocks: [],
    successMetrics: [],
    milestones: []
  })

  useEffect(() => {
    if (userData?.plan_data) {
      setPlan(userData.plan_data)
    }
    loadSupabaseData()
  }, [userData])

  const loadSupabaseData = async () => {
    try {
      const supabase = getSupabaseBrowser()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      // Load all data in parallel
      const [kpisResult, companiesResult, dailyNonNegotiablesResult, scheduleBlocksResult, successMetricsResult, milestonesResult] = await Promise.all([
        supabase.from('kpis').select('*').eq('user_id', user.id),
        supabase.from('companies').select('*').eq('user_id', user.id),
        supabase.from('daily_nonnegotiables').select('*').eq('user_id', user.id),
        supabase.from('schedule_blocks').select('*').eq('user_id', user.id),
        supabase.from('success_metrics').select('*').eq('user_id', user.id),
        supabase.from('milestones').select('*').eq('user_id', user.id)
      ])

      setSupabaseData({
        kpis: kpisResult.data || [],
        companies: companiesResult.data || [],
        dailyNonNegotiables: dailyNonNegotiablesResult.data || [],
        scheduleBlocks: scheduleBlocksResult.data || [],
        successMetrics: successMetricsResult.data || [],
        milestones: milestonesResult.data || []
      })
    } catch (error) {
      console.error('Error loading Supabase data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    onSave(plan)
    setIsEditing(false)
  }

  const updatePlan = (updates: any) => {
    setPlan(prev => ({ ...prev, ...updates }))
  }

  const updateKPI = async (kpiId: string, newCurrent: number) => {
    try {
      const supabase = getSupabaseBrowser()
      const { error } = await supabase
        .from('kpis')
        .update({ current: newCurrent })
        .eq('id', kpiId)

      if (error) throw error

      // Update local state
      setSupabaseData(prev => ({
        ...prev,
        kpis: prev.kpis.map(kpi => 
          kpi.id === kpiId ? { ...kpi, current: newCurrent } : kpi
        )
      }))
    } catch (error) {
      console.error('Error updating KPI:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your career data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🚀 {plan.meta?.title || "Career Execution Plan"}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                {plan.meta?.subtitle || "Your personal career execution guide"}
              </p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              {isEditing ? 'Cancel' : 'Edit Plan'}
            </button>
          </div>
          
          {plan.meta?.badges && (
            <div className="mt-4 flex flex-wrap gap-2">
              {plan.meta.badges.map((badge, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Current Status */}
      {plan.current && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Current Status</h3>
            <ul className="space-y-2">
              {plan.current.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5">•</span>
                  <span className="ml-3 text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Phases */}
      {plan.phases && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Career Phases</h3>
            <div className="space-y-6">
              {plan.phases.map((phase, phaseIndex) => (
                <div key={phaseIndex} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="text-md font-semibold text-gray-900">{phase.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{phase.dates}</p>
                  
                  {phase.pillars && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {phase.pillars.map((pillar, pillarIndex) => (
                        <div key={pillarIndex} className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-2">{pillar.title}</h5>
                          <ul className="space-y-1">
                            {pillar.items?.map((item, itemIndex) => (
                              <li key={itemIndex} className="text-sm text-gray-700 flex items-start">
                                <span className="flex-shrink-0 h-4 w-4 text-green-500 mt-0.5 mr-2">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Key Performance Indicators</h3>
          {loading ? (
            <div className="text-center py-4">Loading KPIs...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {supabaseData.kpis.map((kpi) => (
                <div key={kpi.id} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">{kpi.label}</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={kpi.current}
                            onChange={(e) => updateKPI(kpi.id, parseInt(e.target.value) || 0)}
                            className="w-16 px-1 py-0.5 text-xs border border-gray-300 rounded"
                            min="0"
                          />
                          <span className="font-medium">/{kpi.target}</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min((kpi.current / kpi.target) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Phase {kpi.phase} • {kpi.key}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Companies */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Target Companies</h3>
          {loading ? (
            <div className="text-center py-4">Loading companies...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {supabaseData.companies.map((company) => (
                <div key={company.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{company.name}</h4>
                      <p className="text-sm text-gray-600">Tier: {company.tier}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      company.status === 'lead' ? 'bg-yellow-100 text-yellow-800' :
                      company.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                      company.status === 'interview' ? 'bg-purple-100 text-purple-800' :
                      company.status === 'offer' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {company.status}
                    </span>
                  </div>
                  {company.notes && (
                    <p className="text-sm text-gray-600 mt-2">{company.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Daily Non-Negotiables */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Non-Negotiables</h3>
          {loading ? (
            <div className="text-center py-4">Loading daily tasks...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['morning', 'evening'].map((timeOfDay) => (
                <div key={timeOfDay} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3 capitalize">{timeOfDay} Routine</h4>
                  <div className="space-y-2">
                    {supabaseData.dailyNonNegotiables
                      .filter(item => item.time_of_day === timeOfDay)
                      .sort((a, b) => a.order_index - b.order_index)
                      .map((item) => (
                        <div key={item.id} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div className="flex-1">
                            <span className="text-sm text-gray-900">{item.item}</span>
                            <span className="text-xs text-gray-500 ml-2">({item.duration_minutes}min)</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Schedule</h3>
          {loading ? (
            <div className="text-center py-4">Loading schedule...</div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, dayIndex) => (
                <div key={day} className="bg-gray-50 p-2 rounded-lg">
                  <h4 className="font-medium text-gray-900 text-center mb-2">{day}</h4>
                  <div className="space-y-1">
                    {supabaseData.scheduleBlocks
                      .filter(block => block.day === dayIndex)
                      .sort((a, b) => a.start.localeCompare(b.start))
                      .map((block) => (
                        <div key={block.id} className="text-xs bg-white p-1 rounded border">
                          <div className="font-medium">{block.title}</div>
                          <div className="text-gray-500">{block.start} - {block.end}</div>
                          <div className={`text-xs px-1 py-0.5 rounded ${
                            block.tag === 'gym' ? 'bg-red-100 text-red-800' :
                            block.tag === 'market' ? 'bg-green-100 text-green-800' :
                            block.tag === 'study' ? 'bg-blue-100 text-blue-800' :
                            block.tag === 'network' ? 'bg-purple-100 text-purple-800' :
                            block.tag === 'content' ? 'bg-yellow-100 text-yellow-800' :
                            block.tag === 'meal' ? 'bg-orange-100 text-orange-800' :
                            'bg-pink-100 text-pink-800'
                          }`}>
                            {block.tag}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Daily Focus */}
      {plan.meta?.todayFocus && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Focus</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(plan.meta.todayFocus).map(([day, focus]) => (
                <div key={day} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">{day}</h4>
                  <p className="text-sm text-gray-700">{focus}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      {isEditing && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm font-medium"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  )
}

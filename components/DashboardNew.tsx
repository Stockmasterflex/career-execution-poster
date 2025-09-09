'use client'

import React, { useState, useEffect } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { Textarea } from './ui/Textarea'
import { SectionHeader } from './ui/SectionHeader'
import { KpiCard } from './ui/KpiCard'
import { ChecklistItem } from './ui/ChecklistItem'
import { CompanyRow } from './ui/CompanyRow'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { EmptyState } from './ui/EmptyState'
import { 
  Home, 
  Target, 
  TrendingUp, 
  Trophy, 
  Calendar,
  CheckCircle,
  Clock,
  Dumbbell,
  BookOpen,
  Users,
  Utensils,
  Sun,
  Moon,
  BarChart3,
  Compass
} from 'lucide-react'
import Link from 'next/link'

interface DailyNonNegotiable {
  id: string
  item: string
  time_of_day: 'morning' | 'evening'
  duration_minutes: number
  order_index: number
}

interface DailyTask {
  id: string
  item_id: string
  completed: boolean
  completed_at: string | null
}

interface KPI {
  id: string
  phase: number
  key: string
  label: string
  target: number
  current: number
}

interface Company {
  id: string
  name: string
  tier: 'T1A' | 'T1B' | 'T2'
  status: 'lead' | 'applied' | 'interview' | 'offer' | 'rejected'
  notes?: string
}

export default function DashboardNew() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [todaysFocus, setTodaysFocus] = useState('')
  const [dailyNonNegotiables, setDailyNonNegotiables] = useState<DailyNonNegotiable[]>([])
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([])
  const [kpis, setKpis] = useState<KPI[]>([])
  const [companies, setCompanies] = useState<Company[]>([])

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const supabase = getSupabaseBrowser()
      
      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)

      if (currentUser) {
        // Load daily non-negotiables
        const { data: nonNegotiables } = await supabase
          .from('daily_nonnegotiables')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('time_of_day', { ascending: true })
          .order('order_index', { ascending: true })

        setDailyNonNegotiables(nonNegotiables || [])

        // Load today's tasks
        const today = new Date().toISOString().split('T')[0]
        const { data: tasks } = await supabase
          .from('daily_tasks')
          .select('*')
          .eq('user_id', currentUser.id)
          .eq('date', today)

        setDailyTasks(tasks || [])

        // Load KPIs (Phase 1 only for dashboard)
        const { data: kpiData } = await supabase
          .from('kpis')
          .select('*')
          .eq('user_id', currentUser.id)
          .eq('phase', 1)

        setKpis(kpiData || [])

        // Load companies
        const { data: companyData } = await supabase
          .from('companies')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('tier', { ascending: true })
          .order('name', { ascending: true })

        setCompanies(companyData || [])
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowser()
    await supabase.auth.signOut()
  }

  const toggleTask = async (itemId: string, completed: boolean) => {
    try {
      const supabase = getSupabaseBrowser()
      const today = new Date().toISOString().split('T')[0]

      if (completed) {
        // Create or update task
        const { error } = await supabase
          .from('daily_tasks')
          .upsert({
            user_id: user.id,
            date: today,
            item_id: itemId,
            completed: true,
            completed_at: new Date().toISOString()
          })

        if (error) throw error
      } else {
        // Delete task
        const { error } = await supabase
          .from('daily_tasks')
          .delete()
          .eq('user_id', user.id)
          .eq('date', today)
          .eq('item_id', itemId)

        if (error) throw error
      }

      // Reload tasks
      await loadUserData()
    } catch (error) {
      console.error('Error toggling task:', error)
    }
  }

  const updateKPI = async (kpiId: string, current: number) => {
    try {
      const supabase = getSupabaseBrowser()
      const { error } = await supabase
        .from('kpis')
        .update({ current })
        .eq('id', kpiId)

      if (error) throw error

      setKpis(prev => prev.map(kpi => 
        kpi.id === kpiId ? { ...kpi, current } : kpi
      ))
    } catch (error) {
      console.error('Error updating KPI:', error)
    }
  }

  const getTaskStatus = (itemId: string) => {
    const task = dailyTasks.find(t => t.item_id === itemId)
    return task?.completed || false
  }

  const getStreak = (itemId: string) => {
    // This would need a more complex query to calculate actual streak
    // For now, return 0
    return 0
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-text">Loading your career plan...</p>
        </div>
      </div>
    )
  }

  const morningItems = dailyNonNegotiables.filter(item => item.time_of_day === 'morning')
  const eveningItems = dailyNonNegotiables.filter(item => item.time_of_day === 'evening')

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="dashboard-bg text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center gap-3">
              <Home className="w-8 h-8" />
              <div>
                <h1 className="text-4xl font-bold">Career OS Dashboard</h1>
                <p className="text-blue-100 text-lg">Daily Execution & Weekly Planning</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">Today's Date</p>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 mt-2"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Today's Focus */}
        <Card variant="glass">
          <CardHeader>
            <div className="section-header">
              <div className="section-icon">
                <Sun className="w-5 h-5" />
              </div>
              <h2 className="section-title">Today's Focus</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-text-primary font-medium">Today</p>
              <div className="space-y-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Non-Negotiables */}
        <Card variant="glass">
          <CardHeader>
            <div className="section-header">
              <div className="section-icon">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h2 className="section-title">Daily Non-Negotiables</h2>
              <span className="section-subtitle">2 Hours Total</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Morning Power Hour */}
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-text-primary">Morning Power Hour (60 min)</h3>
                </div>
                <p className="text-sm text-text-secondary mb-3">5:30 AM - 6:30 AM</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-text-primary">Market analysis + trade journal (25 min)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                    <span className="text-sm text-text-primary">CMT study or skill dev (25 min)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                    <span className="text-sm text-text-primary">LinkedIn engagement + content planning (10 min)</span>
                  </div>
                </div>
              </div>

              {/* Evening Power Hour */}
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center gap-2 mb-4">
                  <Moon className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-text-primary">Evening Power Hour (60 min)</h3>
                </div>
                <p className="text-sm text-text-secondary mb-3">7:00 PM - 8:00 PM</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                    <span className="text-sm text-text-primary">Close review + tomorrow's setup (20 min)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                    <span className="text-sm text-text-primary">Outreach or content creation (25 min)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                    <span className="text-sm text-text-primary">Goals review + next-day plan (15 min)</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Execution Schedule */}
        <Card variant="glass">
          <CardHeader>
            <div className="section-header">
              <div className="section-icon">
                <Calendar className="w-5 h-5" />
              </div>
              <h2 className="section-title">Weekly Execution Schedule</h2>
              <span className="section-subtitle">Color-Coded Time Blocks</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-sm text-text-secondary">Phase 1 • Week __ • Sept-Dec 2025 • Days left: __</p>
            </div>
            
            {/* KPI Overview */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-100 rounded-lg p-3 text-center">
                <p className="text-sm font-medium text-text-primary">LEADS</p>
                <p className="text-lg font-bold text-text-primary">-</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-3 text-center">
                <p className="text-sm font-medium text-text-primary">APPS (WK)</p>
                <p className="text-lg font-bold text-text-primary">-</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-3 text-center">
                <p className="text-sm font-medium text-text-primary">INTERVIEWS</p>
                <p className="text-lg font-bold text-text-primary">-</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-3 text-center">
                <p className="text-sm font-medium text-text-primary">OFFERS</p>
                <p className="text-lg font-bold text-text-primary">-</p>
              </div>
            </div>

            {/* Monday-Friday Structured Blocks */}
            <div className="space-y-4">
              {/* Gym */}
              <div className="time-block time-block-gym">
                <div className="flex items-center gap-2 mb-2">
                  <Dumbbell className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-text-primary">5:30 AM - 7:00 AM</span>
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Gym First Thing</h3>
                <div className="grid grid-cols-5 gap-2 text-sm text-text-secondary">
                  <div>Mon: Chest + Triceps</div>
                  <div>Tue: Back + Biceps</div>
                  <div>Wed: Core + Cardio</div>
                  <div>Thu: Shoulders + Arms</div>
                  <div>Fri: Legs + Glutes</div>
                </div>
              </div>

              {/* Market Prep + Trading */}
              <div className="time-block time-block-study">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-text-primary">6:30 AM - 1:00 PM</span>
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Market Prep + Trading</h3>
                <p className="text-sm text-text-secondary">Charting, analysis, trade journaling, and post creation (LinkedIn, Twitter, website content)</p>
              </div>

              {/* CMT Study */}
              <div className="time-block time-block-study">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-text-primary">2:00 PM - 3:00 PM</span>
                </div>
                <h3 className="font-semibold text-text-primary mb-2">CMT Study</h3>
                <p className="text-sm text-text-secondary">Monday-Friday focused study session</p>
              </div>

              {/* Networking & Apps */}
              <div className="time-block time-block-network">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-pink-600" />
                  <span className="font-medium text-text-primary">3:00 PM - 5:00 PM</span>
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Networking & Apps (Career Ops)</h3>
                <p className="text-sm text-text-secondary">Mon/Wed/Fri: Networking & Applications | Tue/Thu: Content & Branding (posts, website, portfolio)</p>
              </div>

              {/* Dinner + Evening Flex */}
              <div className="time-block time-block-meals">
                <div className="flex items-center gap-2 mb-2">
                  <Utensils className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-text-primary">6:00 PM - 8:00 PM</span>
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Dinner + Evening Flex (Family/Recharge)</h3>
                <p className="text-sm text-text-secondary">Light networking, study review, family time</p>
              </div>
            </div>

            {/* Weekend Focus Blocks */}
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="time-block time-block-family">
                <div className="flex items-center gap-2 mb-2">
                  <Sun className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-text-primary">Saturday</span>
                </div>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• Major CMT Study (3-4 hrs)</li>
                  <li>• Legend Room dev or long-form content</li>
                  <li>• Recharge (Date night/friends)</li>
                </ul>
              </div>

              <div className="time-block time-block-family">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-text-primary">Sunday</span>
                </div>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• Strategic Planning + Market Outlook</li>
                  <li>• Family + Reset</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Output */}
        <Card variant="glass">
          <CardHeader>
            <h2 className="section-title">Daily Output (Mon-Fri)</h2>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                  <span className="text-sm text-text-primary">Ship 1 post or 1 substantive comment</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                  <span className="text-sm text-text-primary">Update trade journal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                  <span className="text-sm text-text-primary">Send 2-3 networking DMs (MWF)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                  <span className="text-sm text-text-primary">CMT study 60 min</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-4 gap-2 text-xs text-text-secondary">
                  <div className="text-center">Gym</div>
                  <div className="text-center">CMT</div>
                  <div className="text-center">Posts</div>
                  <div className="text-center">DMs</div>
                  <div className="text-center">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded mx-auto"></div>
                  </div>
                  <div className="text-center">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded mx-auto"></div>
                  </div>
                  <div className="text-center">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded mx-auto"></div>
                  </div>
                  <div className="text-center">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded mx-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phase 1 KPI Progress */}
        <Card variant="glass">
          <CardHeader>
            <div className="section-header">
              <div className="section-icon">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h2 className="section-title">Phase 1 KPI Progress</h2>
              <span className="section-subtitle">Quick Glance - Sept-Dec 2025</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kpis.length > 0 ? (
                kpis.map((kpi) => (
                  <KpiCard
                    key={kpi.id}
                    title={kpi.label}
                    current={kpi.current}
                    target={kpi.target}
                    phase={kpi.phase}
                    onUpdate={(value) => updateKPI(kpi.id, value)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-text-secondary">No KPIs found - will appear here once seeded</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Navigation */}
        <Card variant="glass">
          <CardHeader>
            <div className="section-header">
              <div className="section-icon">
                <Compass className="w-5 h-5" />
              </div>
              <h2 className="section-title">Quick Navigation</h2>
              <span className="section-subtitle">Jump to Phase Details</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { phase: 1, title: 'Phase 1', description: 'Foundation & Market Entry', color: 'phase-1', href: '/phase-1', icon: Target, date: 'SEPT-DEC 2025' },
                { phase: 2, title: 'Phase 2', description: 'Interview Intensification', color: 'phase-2', href: '/phase-2', icon: Target, date: 'JAN-MAR 2026' },
                { phase: 3, title: 'Phase 3', description: 'Performance & Advancement', color: 'phase-3', href: '/phase-3', icon: TrendingUp, date: '2026-2027' },
                { phase: 4, title: 'Phase 4', description: 'Mastery & Wealth Building', color: 'phase-4', href: '/phase-4', icon: Trophy, date: '2028+' },
                { phase: 'calendar', title: 'Weekly Calendar', description: 'Color-coded time blocks & schedule', color: 'blue', href: '/calendar', icon: Calendar, date: 'JUL 17' },
              ].map((phase) => (
                <Link key={phase.phase} href={phase.href}>
                  <div className="glass-card hover:scale-105 transition-transform cursor-pointer">
                    <div className="text-center">
                      <phase.icon className={`w-8 h-8 mx-auto mb-3 text-${phase.color}`} />
                      <h3 className="font-bold text-lg mb-1 text-text-primary">{phase.title}</h3>
                      <p className="text-sm text-text-secondary mb-2">{phase.description}</p>
                      <p className="text-xs text-text-muted">{phase.date}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

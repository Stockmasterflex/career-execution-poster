'use client'

import { useState, useEffect } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { KpiCard } from '@/components/ui/KpiCard'
import TodayFocus from '@/components/dashboard/TodayFocus'
import DailyNonNegotiables from '@/components/nonnegotiables/DailyNonNegotiables'
import WeeklySchedule from '@/components/schedule/WeeklySchedule'
import CompaniesList from '@/components/companies/CompaniesList'
import Link from 'next/link'
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

interface KPI {
  id: string
  phase: number
  key: string
  label: string
  current: number
  target: number
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [kpis, setKpis] = useState<KPI[]>([])

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
        const { data, error } = await supabase
          .from('user_plans')
          .select('*')
          .eq('user_id', currentUser.id)
          .single()

        if (error && error.code === 'PGRST116') {
          console.log('No user plan found, creating default plan...')
          // Create a default user plan if none exists
          const { data: newPlan, error: createError } = await supabase
            .from('user_plans')
            .upsert({
              user_id: currentUser.id,
              plan_data: {
                todays_focus: '',
                phase: 1
              },
              updated_at: new Date().toISOString()
            })
            .select()
            .single()
          
          if (createError) {
            console.error('Error creating user plan:', createError)
          } else {
            setUserData(newPlan)
          }
        } else if (error) {
          console.error('Error loading user plan:', error)
        } else {
          setUserData(data)
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveUserData = async (planData) => {
    try {
      const supabase = getSupabaseBrowser()
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      if (!currentUser) return

      const { error } = await supabase
        .from('user_plans')
        .upsert({
          user_id: currentUser.id,
          plan_data: planData,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      
      setUserData({ plan_data: planData })
    } catch (error) {
      console.error('Error saving user data:', error)
    }
  }

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowser()
    await supabase.auth.signOut()
  }

  const handleKPIUpdate = (id: string, updates: { current: number; target: number }) => {
    setKpis(prev => prev.map(kpi => 
      kpi.id === id ? { ...kpi, ...updates } : kpi
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4">Loading...</p>
        </div>
      </div>
    )
  }

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
              <p className="text-blue-100 text-sm">Welcome back, {user?.email}</p>
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
        <TodayFocus userId={user.id} />

        {/* Daily Non-Negotiables */}
        <DailyNonNegotiables userId={user.id} />

        {/* Weekly Execution Schedule */}
        <WeeklySchedule userId={user.id} />

        {/* Current Status */}
        <Card variant="glass">
          <CardHeader>
            <div className="section-header">
              <div className="section-icon">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h2 className="section-title">Current Status</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="glass-card p-4">
                <h3 className="font-semibold text-text-primary mb-2">Starting Point</h3>
                <p className="text-text-secondary">Unemployed, 6–8 month runway, SIE exam Sept 6, 2025</p>
              </div>
              <div className="glass-card p-4">
                <h3 className="font-semibold text-text-primary mb-2">Location Advantage</h3>
                <p className="text-text-secondary">Alameda / SF Bay Area (FinTech + Traditional Finance hub)</p>
              </div>
              <div className="glass-card p-4">
                <h3 className="font-semibold text-text-primary mb-2">Unique Edge</h3>
                <p className="text-text-secondary">Technical analysis experience + AI trading projects + Minervini training</p>
              </div>
              <div className="glass-card p-4">
                <h3 className="font-semibold text-text-primary mb-2">Target Outcome</h3>
                <p className="text-text-secondary">$120K–200K+ Technical Analyst by 2028</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Career Phases */}
        <Card variant="glass">
          <CardHeader>
            <div className="section-header">
              <div className="section-icon">
                <Target className="w-5 h-5" />
              </div>
              <h2 className="section-title">Career Phases</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { phase: 1, title: 'Phase 1', description: 'Foundation & Market Entry', color: 'phase-1', href: '/phase-1', icon: Target, date: 'SEPT-DEC 2025' },
                { phase: 2, title: 'Phase 2', description: 'Interview Intensification', color: 'phase-2', href: '/phase-2', icon: Target, date: 'JAN-MAR 2026' },
                { phase: 3, title: 'Phase 3', description: 'Performance & Advancement', color: 'phase-3', href: '/phase-3', icon: TrendingUp, date: '2026-2027' },
                { phase: 4, title: 'Phase 4', description: 'Mastery & Wealth Building', color: 'phase-4', href: '/phase-4', icon: Trophy, date: '2028+' },
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

        {/* Target Companies */}
        <CompaniesList userId={user.id} />

        {/* Key Performance Indicators */}
        <Card variant="glass">
          <CardHeader>
            <div className="section-header">
              <div className="section-icon">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h2 className="section-title">Key Performance Indicators</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <KpiCard
                id="cmt-study"
                userId={user.id}
                phase={1}
                key="cmt_study_progress"
                label="CMT Study Progress"
                current={15}
                target={100}
                onUpdate={handleKPIUpdate}
              />
              <KpiCard
                id="networking-dms"
                userId={user.id}
                phase={1}
                key="networking_dms"
                label="Networking DMs"
                current={3}
                target={40}
                onUpdate={handleKPIUpdate}
              />
              <KpiCard
                id="coffee-chats"
                userId={user.id}
                phase={1}
                key="coffee_chats"
                label="Coffee Chats"
                current={1}
                target={8}
                onUpdate={handleKPIUpdate}
              />
              <KpiCard
                id="applications"
                userId={user.id}
                phase={1}
                key="applications_sent"
                label="Applications Sent"
                current={3}
                target={50}
                onUpdate={handleKPIUpdate}
              />
              <KpiCard
                id="linkedin-posts"
                userId={user.id}
                phase={1}
                key="linkedin_posts"
                label="LinkedIn/Twitter Posts"
                current={7}
                target={40}
                onUpdate={handleKPIUpdate}
              />
              <KpiCard
                id="website-build"
                userId={user.id}
                phase={1}
                key="website_build"
                label="Website Build"
                current={25}
                target={100}
                onUpdate={handleKPIUpdate}
              />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

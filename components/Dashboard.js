'use client'

import { useState, useEffect } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import CareerPlan from './CareerPlan'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)

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

        if (error && error.code !== 'PGRST116') {
          throw error
        }

        setUserData(data)
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your career plan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Career OS</h1>
              <p className="text-sm text-gray-500">Welcome back, {user?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <CareerPlan 
          userData={userData} 
          onSave={saveUserData}
        />
      </main>
    </div>
  )
}

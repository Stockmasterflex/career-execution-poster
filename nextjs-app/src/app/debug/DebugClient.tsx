'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ensureBootstrap } from '@/lib/ensureBootstrap'

interface DebugClientProps {
  userId: string
  userEmail: string | undefined
}

interface TableCounts {
  daily_nonnegotiables: number
  daily_tasks: number
  schedule_blocks: number
}

export default function DebugClient({ userId, userEmail }: DebugClientProps) {
  const [counts, setCounts] = useState<TableCounts>({
    daily_nonnegotiables: 0,
    daily_tasks: 0,
    schedule_blocks: 0
  })
  const [loading, setLoading] = useState(true)
  const [bootstrapLoading, setBootstrapLoading] = useState(false)
  const [lastBootstrapResult, setLastBootstrapResult] = useState<string>('')

  const loadCounts = async () => {
    try {
      console.log('[DEBUG] Loading table counts...')
      
      const [nonnegotiablesResult, tasksResult, scheduleResult] = await Promise.all([
        supabase
          .from('daily_nonnegotiables')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId),
        supabase
          .from('daily_tasks')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId),
        supabase
          .from('schedule_blocks')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId)
      ])

      setCounts({
        daily_nonnegotiables: nonnegotiablesResult.count || 0,
        daily_tasks: tasksResult.count || 0,
        schedule_blocks: scheduleResult.count || 0
      })

      console.log('[DEBUG] Counts loaded:', {
        daily_nonnegotiables: nonnegotiablesResult.count || 0,
        daily_tasks: tasksResult.count || 0,
        schedule_blocks: scheduleResult.count || 0
      })

    } catch (error) {
      console.error('[DEBUG] Error loading counts:', error)
    } finally {
      setLoading(false)
    }
  }

  const runBootstrap = async () => {
    try {
      console.log('[DEBUG] Running bootstrap...')
      setBootstrapLoading(true)
      setLastBootstrapResult('')
      
      const result = await ensureBootstrap(supabase)
      
      setLastBootstrapResult(JSON.stringify(result, null, 2))
      
      // Reload counts after bootstrap
      await loadCounts()
      
    } catch (error) {
      console.error('[DEBUG] Error running bootstrap:', error)
      setLastBootstrapResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setBootstrapLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  useEffect(() => {
    loadCounts()
  }, [userId])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Debug Page</h1>
            <div className="flex items-center space-x-4">
              <a
                href="/dashboard"
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Dashboard
              </a>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Session Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Session Information</h2>
            <div className="space-y-2">
              <p><strong>User ID:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-sm">{userId}</code></p>
              <p><strong>Email:</strong> {userEmail || 'N/A'}</p>
            </div>
          </div>

          {/* Table Counts */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Table Counts</h2>
            {loading ? (
              <p className="text-gray-600">Loading counts...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800">Daily Non-Negotiables</h3>
                  <p className="text-2xl font-bold text-blue-600">{counts.daily_nonnegotiables}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-800">Daily Tasks</h3>
                  <p className="text-2xl font-bold text-green-600">{counts.daily_tasks}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-800">Schedule Blocks</h3>
                  <p className="text-2xl font-bold text-purple-600">{counts.schedule_blocks}</p>
                </div>
              </div>
            )}
          </div>

          {/* Bootstrap Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Bootstrap Actions</h2>
            <div className="space-y-4">
              <button
                onClick={runBootstrap}
                disabled={bootstrapLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bootstrapLoading ? 'Running Bootstrap...' : 'Run Bootstrap'}
              </button>
              
              <button
                onClick={loadCounts}
                disabled={loading}
                className="ml-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Refreshing...' : 'Refresh Counts'}
              </button>
            </div>

            {lastBootstrapResult && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-800 mb-2">Last Bootstrap Result:</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {lastBootstrapResult}
                </pre>
              </div>
            )}
          </div>

          {/* Status Indicators */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Status Indicators</h2>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${counts.daily_nonnegotiables > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>Daily Non-Negotiables: {counts.daily_nonnegotiables > 0 ? 'Has Data' : 'Empty'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${counts.schedule_blocks > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>Schedule Blocks: {counts.schedule_blocks > 0 ? 'Has Data' : 'Empty'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${counts.daily_tasks > 0 ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span>Daily Tasks: {counts.daily_tasks > 0 ? 'Has Data' : 'No Tasks Yet'}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
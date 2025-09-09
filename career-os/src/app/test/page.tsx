'use client'

import { useAuth } from '@/contexts/AuthContext'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function TestPage() {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      redirect('/')
    }
  }, [user, loading])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Career OS Test Page</h1>
        
        <div className="space-y-6">
          <div className="bg-card-bg backdrop-blur-glass border border-border rounded-glass p-6 shadow-card">
            <h2 className="text-xl font-semibold text-white mb-4">Authentication Status</h2>
            <div className="space-y-2">
              <p className="text-gray-300">User ID: <span className="text-white font-mono">{user.id}</span></p>
              <p className="text-gray-300">Email: <span className="text-white">{user.email}</span></p>
              <p className="text-gray-300">Created: <span className="text-white">{new Date(user.created_at).toLocaleString()}</span></p>
            </div>
          </div>

          <div className="bg-card-bg backdrop-blur-glass border border-border rounded-glass p-6 shadow-card">
            <h2 className="text-xl font-semibold text-white mb-4">Database Connection</h2>
            <p className="text-gray-300">If you can see this page, the authentication and basic setup is working.</p>
            <p className="text-gray-300 mt-2">Next steps:</p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
              <li>Set up your Supabase database with the provided schema</li>
              <li>Add your Supabase URL and anon key to .env.local</li>
              <li>Test the full application functionality</li>
            </ul>
          </div>

          <div className="bg-card-bg backdrop-blur-glass border border-border rounded-glass p-6 shadow-card">
            <h2 className="text-xl font-semibold text-white mb-4">Environment Variables</h2>
            <div className="space-y-2">
              <p className="text-gray-300">
                Supabase URL: <span className="text-white font-mono">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set'}
                </span>
              </p>
              <p className="text-gray-300">
                Supabase Anon Key: <span className="text-white font-mono">
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
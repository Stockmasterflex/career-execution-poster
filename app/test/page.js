'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function TestPage() {
  const [status, setStatus] = useState('Loading...')
  const [session, setSession] = useState(null)

  useEffect(() => {
    async function testAuth() {
      try {
        setStatus('Testing Supabase connection...')
        
        // Test basic connection
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          setStatus(`Error: ${error.message}`)
          return
        }
        
        setSession(session)
        setStatus(session ? 'Authenticated' : 'Not authenticated')
        
      } catch (err) {
        setStatus(`Error: ${err.message}`)
      }
    }
    
    testAuth()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Test Page</h1>
      <p className="mb-4">Status: {status}</p>
      {session && (
        <div className="bg-green-100 p-4 rounded">
          <p>User: {session.user.email}</p>
          <p>User ID: {session.user.id}</p>
        </div>
      )}
      {!session && (
        <div className="bg-yellow-100 p-4 rounded">
          <p>No active session. You should see the auth form.</p>
        </div>
      )}
    </div>
  )
}

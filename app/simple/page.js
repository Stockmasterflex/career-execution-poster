'use client'

import { useState } from 'react'

export default function SimplePage() {
  const [result, setResult] = useState('Not tested yet')

  const testSupabase = async () => {
    try {
      setResult('Testing...')
      
      // Import Supabase client dynamically
      const { createClient } = await import('@supabase/supabase-js')
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        setResult('Error: Environment variables not set')
        return
      }
      
      const supabase = createClient(supabaseUrl, supabaseKey)
      
      // Test basic connection
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        setResult(`Error: ${error.message}`)
        return
      }
      
      setResult(`Success! Session: ${data.session ? 'Active' : 'None'}`)
      
    } catch (err) {
      setResult(`Error: ${err.message}`)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Supabase Test</h1>
      <button 
        onClick={testSupabase}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Test Supabase Connection
      </button>
      <p><strong>Result:</strong> {result}</p>
    </div>
  )
}

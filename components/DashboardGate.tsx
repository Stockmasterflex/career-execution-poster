'use client'
import { useEffect, useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import Auth from '@/components/Auth'

export default function DashboardGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    const supabase = getSupabaseBrowser()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthed(!!session)
      setReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setAuthed(!!session)
    })
    return () => { sub.subscription.unsubscribe() }
  }, [])

  if (!ready) return <div className="p-6 text-text-white">Loading…</div>
  if (!authed) return <Auth />
  return <>{children}</>
}
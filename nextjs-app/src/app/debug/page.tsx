import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import DebugClient from './DebugClient'

export default async function DebugPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/auth')
  }

  return <DebugClient userId={user.id} userEmail={user.email} />
}
import { createBrowserClient } from '@supabase/ssr'

let _client: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseBrowser() {
  if (_client) return _client
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log('Supabase client: Initializing with URL:', url ? 'present' : 'missing')
  console.log('Supabase client: Initializing with key:', key ? 'present' : 'missing')
  
  if (!url || !key) {
    console.error('Supabase client: Missing environment variables!')
    throw new Error('Missing Supabase environment variables')
  }
  
  _client = createBrowserClient(url, key)
  console.log('Supabase client: Created successfully')
  return _client
}
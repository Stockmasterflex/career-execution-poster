import { createClient } from '@/lib/supabase-browser'
import type { Database } from '@/lib/database.types'

type UserData = {
  kpis: Database['public']['Tables']['kpis']['Row'][]
  companies: Database['public']['Tables']['companies']['Row'][]
  schedule_blocks: Database['public']['Tables']['schedule_blocks']['Row'][]
  daily_nonnegotiables: Database['public']['Tables']['daily_nonnegotiables']['Row'][]
  daily_tasks: Database['public']['Tables']['daily_tasks']['Row'][]
}

export async function exportUserData(userId: string): Promise<UserData> {
  const supabase = createClient()

  const [kpisResult, companiesResult, scheduleResult, nonnegotiablesResult, tasksResult] = await Promise.all([
    supabase.from('kpis').select('*').eq('user_id', userId),
    supabase.from('companies').select('*').eq('user_id', userId),
    supabase.from('schedule_blocks').select('*').eq('user_id', userId),
    supabase.from('daily_nonnegotiables').select('*').eq('user_id', userId),
    supabase.from('daily_tasks').select('*').eq('user_id', userId),
  ])

  if (kpisResult.error) throw new Error('Failed to export KPIs')
  if (companiesResult.error) throw new Error('Failed to export companies')
  if (scheduleResult.error) throw new Error('Failed to export schedule blocks')
  if (nonnegotiablesResult.error) throw new Error('Failed to export non-negotiables')
  if (tasksResult.error) throw new Error('Failed to export daily tasks')

  return {
    kpis: kpisResult.data || [],
    companies: companiesResult.data || [],
    schedule_blocks: scheduleResult.data || [],
    daily_nonnegotiables: nonnegotiablesResult.data || [],
    daily_tasks: tasksResult.data || [],
  }
}

export async function importUserData(userId: string, data: UserData): Promise<void> {
  const supabase = createClient()

  // Clear existing data
  await Promise.all([
    supabase.from('daily_tasks').delete().eq('user_id', userId),
    supabase.from('daily_nonnegotiables').delete().eq('user_id', userId),
    supabase.from('schedule_blocks').delete().eq('user_id', userId),
    supabase.from('companies').delete().eq('user_id', userId),
    supabase.from('kpis').delete().eq('user_id', userId),
  ])

  // Insert new data
  const insertPromises = []

  if (data.kpis.length > 0) {
    const kpisWithUserId = data.kpis.map(kpi => ({ ...kpi, user_id: userId }))
    insertPromises.push(supabase.from('kpis').insert(kpisWithUserId))
  }

  if (data.companies.length > 0) {
    const companiesWithUserId = data.companies.map(company => ({ ...company, user_id: userId }))
    insertPromises.push(supabase.from('companies').insert(companiesWithUserId))
  }

  if (data.schedule_blocks.length > 0) {
    const scheduleWithUserId = data.schedule_blocks.map(block => ({ ...block, user_id: userId }))
    insertPromises.push(supabase.from('schedule_blocks').insert(scheduleWithUserId))
  }

  if (data.daily_nonnegotiables.length > 0) {
    const nonnegotiablesWithUserId = data.daily_nonnegotiables.map(task => ({ ...task, user_id: userId }))
    insertPromises.push(supabase.from('daily_nonnegotiables').insert(nonnegotiablesWithUserId))
  }

  if (data.daily_tasks.length > 0) {
    const tasksWithUserId = data.daily_tasks.map(task => ({ ...task, user_id: userId }))
    insertPromises.push(supabase.from('daily_tasks').insert(tasksWithUserId))
  }

  const results = await Promise.all(insertPromises)
  
  for (const result of results) {
    if (result.error) {
      throw new Error(`Failed to import data: ${result.error.message}`)
    }
  }
}

export function downloadJSON(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function uploadJSON(): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) {
        reject(new Error('No file selected'))
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          resolve(data)
        } catch (error) {
          reject(new Error('Invalid JSON file'))
        }
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    }
    input.click()
  })
}
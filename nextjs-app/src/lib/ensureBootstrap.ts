import { SupabaseClient } from '@supabase/supabase-js'

export interface BootstrapResult {
  seeded: boolean
  error?: string
}

export async function ensureBootstrap(supabase: SupabaseClient): Promise<BootstrapResult> {
  try {
    console.log('[BOOTSTRAP] Starting bootstrap check...')
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error('[BOOTSTRAP] No authenticated user found:', userError)
      return { seeded: false, error: 'No authenticated user' }
    }

    console.log('[BOOTSTRAP] User authenticated:', user.email)

    // Check counts for daily_nonnegotiables and schedule_blocks
    const [nonnegotiablesResult, scheduleResult] = await Promise.all([
      supabase
        .from('daily_nonnegotiables')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id),
      supabase
        .from('schedule_blocks')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
    ])

    if (nonnegotiablesResult.error) {
      console.error('[BOOTSTRAP] Error checking daily_nonnegotiables:', nonnegotiablesResult.error)
      return { seeded: false, error: nonnegotiablesResult.error.message }
    }

    if (scheduleResult.error) {
      console.error('[BOOTSTRAP] Error checking schedule_blocks:', scheduleResult.error)
      return { seeded: false, error: scheduleResult.error.message }
    }

    const nonnegotiablesCount = nonnegotiablesResult.count || 0
    const scheduleCount = scheduleResult.count || 0

    console.log('[BOOTSTRAP] Current counts - nonnegotiables:', nonnegotiablesCount, 'schedule:', scheduleCount)

    // If both have data, no need to seed
    if (nonnegotiablesCount > 0 && scheduleCount > 0) {
      console.log('[BOOTSTRAP] Data already exists, skipping bootstrap')
      return { seeded: false }
    }

    let seeded = false

    // Seed daily_nonnegotiables if empty
    if (nonnegotiablesCount === 0) {
      console.log('[BOOTSTRAP] Seeding daily_nonnegotiables...')
      
      const nonnegotiablesData = [
        // Morning items
        { user_id: user.id, time_of_day: 'morning', item: 'Market open review', order_index: 1 },
        { user_id: user.id, time_of_day: 'morning', item: 'CMT study (45m)', order_index: 2 },
        { user_id: user.id, time_of_day: 'morning', item: 'LinkedIn engagement (15m)', order_index: 3 },
        // Evening items
        { user_id: user.id, time_of_day: 'evening', item: 'Close review + notes', order_index: 1 },
        { user_id: user.id, time_of_day: 'evening', item: 'Outreach / content (30m)', order_index: 2 },
        { user_id: user.id, time_of_day: 'evening', item: 'Plan tomorrow (5m)', order_index: 3 }
      ]

      const { error: nonnegotiablesError } = await supabase
        .from('daily_nonnegotiables')
        .insert(nonnegotiablesData)

      if (nonnegotiablesError) {
        console.error('[BOOTSTRAP] Error inserting daily_nonnegotiables:', nonnegotiablesError)
        return { seeded: false, error: nonnegotiablesError.message }
      }

      console.log('[BOOTSTRAP] Successfully seeded daily_nonnegotiables')
      seeded = true
    }

    // Seed schedule_blocks if empty
    if (scheduleCount === 0) {
      console.log('[BOOTSTRAP] Seeding schedule_blocks...')
      
      const scheduleData = [
        // Monday-Friday
        { user_id: user.id, day: 1, start: '06:30', end: '07:15', tag: 'gym', title: 'Gym', details: 'Morning workout' },
        { user_id: user.id, day: 1, start: '07:30', end: '09:00', tag: 'market', title: 'Market prep', details: 'Market analysis and preparation' },
        { user_id: user.id, day: 1, start: '09:00', end: '11:00', tag: 'study', title: 'CMT study', details: 'Chartered Market Technician study' },
        { user_id: user.id, day: 1, start: '11:00', end: '12:00', tag: 'network', title: 'Networking DMs', details: 'Professional networking outreach' },
        { user_id: user.id, day: 1, start: '13:00', end: '15:00', tag: 'content', title: 'Content / Applications', details: 'Content creation and job applications' },
        { user_id: user.id, day: 1, start: '18:00', end: '19:00', tag: 'family', title: 'Family / Dinner', details: 'Family time and dinner' },
        
        // Tuesday
        { user_id: user.id, day: 2, start: '06:30', end: '07:15', tag: 'gym', title: 'Gym', details: 'Morning workout' },
        { user_id: user.id, day: 2, start: '07:30', end: '09:00', tag: 'market', title: 'Market prep', details: 'Market analysis and preparation' },
        { user_id: user.id, day: 2, start: '09:00', end: '11:00', tag: 'study', title: 'CMT study', details: 'Chartered Market Technician study' },
        { user_id: user.id, day: 2, start: '11:00', end: '12:00', tag: 'network', title: 'Networking DMs', details: 'Professional networking outreach' },
        { user_id: user.id, day: 2, start: '13:00', end: '15:00', tag: 'content', title: 'Content / Applications', details: 'Content creation and job applications' },
        { user_id: user.id, day: 2, start: '18:00', end: '19:00', tag: 'family', title: 'Family / Dinner', details: 'Family time and dinner' },
        
        // Wednesday
        { user_id: user.id, day: 3, start: '06:30', end: '07:15', tag: 'gym', title: 'Gym', details: 'Morning workout' },
        { user_id: user.id, day: 3, start: '07:30', end: '09:00', tag: 'market', title: 'Market prep', details: 'Market analysis and preparation' },
        { user_id: user.id, day: 3, start: '09:00', end: '11:00', tag: 'study', title: 'CMT study', details: 'Chartered Market Technician study' },
        { user_id: user.id, day: 3, start: '11:00', end: '12:00', tag: 'network', title: 'Networking DMs', details: 'Professional networking outreach' },
        { user_id: user.id, day: 3, start: '13:00', end: '15:00', tag: 'content', title: 'Content / Applications', details: 'Content creation and job applications' },
        { user_id: user.id, day: 3, start: '18:00', end: '19:00', tag: 'family', title: 'Family / Dinner', details: 'Family time and dinner' },
        
        // Thursday
        { user_id: user.id, day: 4, start: '06:30', end: '07:15', tag: 'gym', title: 'Gym', details: 'Morning workout' },
        { user_id: user.id, day: 4, start: '07:30', end: '09:00', tag: 'market', title: 'Market prep', details: 'Market analysis and preparation' },
        { user_id: user.id, day: 4, start: '09:00', end: '11:00', tag: 'study', title: 'CMT study', details: 'Chartered Market Technician study' },
        { user_id: user.id, day: 4, start: '11:00', end: '12:00', tag: 'network', title: 'Networking DMs', details: 'Professional networking outreach' },
        { user_id: user.id, day: 4, start: '13:00', end: '15:00', tag: 'content', title: 'Content / Applications', details: 'Content creation and job applications' },
        { user_id: user.id, day: 4, start: '18:00', end: '19:00', tag: 'family', title: 'Family / Dinner', details: 'Family time and dinner' },
        
        // Friday
        { user_id: user.id, day: 5, start: '06:30', end: '07:15', tag: 'gym', title: 'Gym', details: 'Morning workout' },
        { user_id: user.id, day: 5, start: '07:30', end: '09:00', tag: 'market', title: 'Market prep', details: 'Market analysis and preparation' },
        { user_id: user.id, day: 5, start: '09:00', end: '11:00', tag: 'study', title: 'CMT study', details: 'Chartered Market Technician study' },
        { user_id: user.id, day: 5, start: '11:00', end: '12:00', tag: 'network', title: 'Networking DMs', details: 'Professional networking outreach' },
        { user_id: user.id, day: 5, start: '13:00', end: '15:00', tag: 'content', title: 'Content / Applications', details: 'Content creation and job applications' },
        { user_id: user.id, day: 5, start: '18:00', end: '19:00', tag: 'family', title: 'Family / Dinner', details: 'Family time and dinner' },
        
        // Saturday
        { user_id: user.id, day: 6, start: '09:00', end: '10:00', tag: 'family', title: 'Family', details: 'Family time' },
        { user_id: user.id, day: 6, start: '10:00', end: '12:00', tag: 'content', title: 'Personal Project', details: 'Work on personal projects' },
        
        // Sunday
        { user_id: user.id, day: 7, start: '17:00', end: '18:00', tag: 'study', title: 'Weekly review', details: 'Weekly review and planning' },
        { user_id: user.id, day: 7, start: '18:00', end: '19:00', tag: 'meal', title: 'Meal prep', details: 'Weekly meal preparation' }
      ]

      const { error: scheduleError } = await supabase
        .from('schedule_blocks')
        .insert(scheduleData)

      if (scheduleError) {
        console.error('[BOOTSTRAP] Error inserting schedule_blocks:', scheduleError)
        return { seeded: false, error: scheduleError.message }
      }

      console.log('[BOOTSTRAP] Successfully seeded schedule_blocks')
      seeded = true
    }

    console.log('[BOOTSTRAP] Bootstrap completed successfully')
    return { seeded }

  } catch (error) {
    console.error('[BOOTSTRAP] Unexpected error during bootstrap:', error)
    return { seeded: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
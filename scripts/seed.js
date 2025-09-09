import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load .env.local file
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE // use service role for seeding
)

// Test user ID - we'll create this user if it doesn't exist
const TEST_USER_EMAIL = 'test@careeros.com'
const TEST_USER_PASSWORD = 'testpassword123'
let testUserId = null

async function ensureTestUser() {
  // First, try to find existing user
  const { data: existingUsers, error: searchError } = await supabase.auth.admin.listUsers()
  
  if (searchError) {
    console.error('Error searching for users:', searchError)
    return null
  }
  
  const existingUser = existingUsers.users.find(user => user.email === TEST_USER_EMAIL)
  
  if (existingUser) {
    console.log('✅ Found existing test user')
    return existingUser.id
  }
  
  // Create new user
  const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
    email_confirm: true
  })
  
  if (createError) {
    console.error('Error creating test user:', createError)
    return null
  }
  
  console.log('✅ Created test user')
  return newUser.user.id
}

// Types (converted to JSDoc comments for reference)
// KPI: { phase: number; key: string; label: string; target: number; current: number }
// Company: { name: string; tier: 'T1A' | 'T1B' | 'T2'; status: 'lead' | 'applied' | 'interview' | 'offer' | 'rejected'; notes?: string }
// Block: { day: number; start: string; end: string; tag: 'gym' | 'market' | 'study' | 'network' | 'content' | 'meal' | 'family'; title: string; details?: string }
// Metric: { phase: number; area: string; bullets: string[] }
// Milestone: { level: number; name: string; bullets: string[] }

async function checkTableEmpty(tableName) {
  const { count, error } = await supabase
    .from(tableName)
    .select('*', { count: 'exact', head: true })
  
  if (error) {
    console.error(`Error checking ${tableName}:`, error)
    return false
  }
  
  return count === 0
}

async function seedDailyNonNegotiables() {
  if (!(await checkTableEmpty('daily_nonnegotiables'))) {
    console.log('Daily non-negotiables already seeded, skipping...')
    return
  }

  const morningItems = [
    { item: 'Market analysis + trade journal', duration_minutes: 25, order_index: 1 },
    { item: 'CMT study or skill dev', duration_minutes: 25, order_index: 2 },
    { item: 'LinkedIn engagement + content planning', duration_minutes: 10, order_index: 3 }
  ]

  const eveningItems = [
    { item: 'Close review + tomorrow\'s setup', duration_minutes: 20, order_index: 1 },
    { item: 'Outreach or content creation', duration_minutes: 25, order_index: 2 },
    { item: 'Goals review + next-day plan', duration_minutes: 15, order_index: 3 }
  ]

  const items = [
    ...morningItems.map(item => ({ ...item, time_of_day: 'morning', user_id: testUserId })),
    ...eveningItems.map(item => ({ ...item, time_of_day: 'evening', user_id: testUserId }))
  ]

  const { error } = await supabase
    .from('daily_nonnegotiables')
    .insert(items)

  if (error) {
    console.error('Error seeding daily non-negotiables:', error)
  } else {
    console.log('✅ Seeded daily non-negotiables')
  }
}

async function seedKPIs() {
  if (!(await checkTableEmpty('kpis'))) {
    console.log('KPIs already seeded, skipping...')
    return
  }

  const kpis = [
    // Phase 1 KPIs (Sept–Dec 2025)
    { phase: 1, key: 'cmt_study_progress', label: 'CMT Study Progress', target: 100, current: 15, user_id: testUserId },
    { phase: 1, key: 'networking_dms', label: 'Networking DMs', target: 40, current: 3, user_id: testUserId },
    { phase: 1, key: 'coffee_chats', label: 'Coffee Chats', target: 8, current: 1, user_id: testUserId },
    { phase: 1, key: 'applications_sent', label: 'Applications Sent', target: 50, current: 3, user_id: testUserId },
    { phase: 1, key: 'linkedin_posts', label: 'LinkedIn/Twitter Posts', target: 40, current: 7, user_id: testUserId },
    { phase: 1, key: 'website_build', label: 'Website Build', target: 100, current: 25, user_id: testUserId },

    // Phase 2 KPIs (Jan–Mar 2026)
    { phase: 2, key: 'applications', label: 'Applications', target: 60, current: 0, user_id: testUserId },
    { phase: 2, key: 'interviews_first_rounds', label: 'Interviews (first rounds)', target: 21, current: 0, user_id: testUserId },
    { phase: 2, key: 'offers', label: 'Offers', target: 3, current: 0, user_id: testUserId },
    { phase: 2, key: 'cmt_ii_registration', label: 'CMT II Registration', target: 1, current: 0, user_id: testUserId },

    // Phase 3 KPIs (Mar 2026–Dec 2027)
    { phase: 3, key: 'salary', label: 'Salary (K base by Dec \'27)', target: 120, current: 0, user_id: testUserId },
    { phase: 3, key: 'network_connections', label: 'Network (meaningful connections)', target: 300, current: 0, user_id: testUserId },
    { phase: 3, key: 'recognition', label: 'Recognition (talks/articles)', target: 3, current: 0, user_id: testUserId },
    { phase: 3, key: 'cmt_ii_complete', label: 'CMT II Complete', target: 1, current: 0, user_id: testUserId },

    // Phase 4 KPIs (2028+)
    { phase: 4, key: 'cmt_charter', label: 'CMT Charter', target: 1, current: 0, user_id: testUserId },
    { phase: 4, key: 'total_compensation', label: 'Total Compensation', target: 150, current: 0, user_id: testUserId },
    { phase: 4, key: 'investment_portfolio', label: 'Investment Portfolio ($k)', target: 500, current: 0, user_id: testUserId },
    { phase: 4, key: 'legend_room_revenue', label: 'Legend Room Revenue ($/mo)', target: 5, current: 0, user_id: testUserId },
    { phase: 4, key: 'industry_recognition', label: 'Industry Recognition', target: 5, current: 0, user_id: testUserId }
  ]

  const { error } = await supabase
    .from('kpis')
    .insert(kpis)

  if (error) {
    console.error('Error seeding KPIs:', error)
  } else {
    console.log('✅ Seeded KPIs')
  }
}

async function seedCompanies() {
  if (!(await checkTableEmpty('companies'))) {
    console.log('Companies already seeded, skipping...')
    return
  }

  const companies = [
    // T1A Companies
    { name: 'Charles Schwab', tier: 'T1A', status: 'lead', user_id: testUserId },
    { name: 'Interactive Brokers', tier: 'T1A', status: 'lead', user_id: testUserId },
    { name: 'Robinhood', tier: 'T1A', status: 'lead', user_id: testUserId },
    { name: 'Franklin Templeton', tier: 'T1A', status: 'lead', user_id: testUserId },
    { name: 'TradeStation', tier: 'T1A', status: 'lead', user_id: testUserId },

    // T1B Companies
    { name: 'Coinbase', tier: 'T1B', status: 'lead', user_id: testUserId },
    { name: 'Plaid', tier: 'T1B', status: 'lead', user_id: testUserId },
    { name: 'Tastytrade', tier: 'T1B', status: 'lead', user_id: testUserId },
    { name: 'Kraken', tier: 'T1B', status: 'lead', user_id: testUserId },
    { name: 'eToro', tier: 'T1B', status: 'lead', user_id: testUserId },

    // T2 Companies
    { name: 'Wells Fargo', tier: 'T2', status: 'lead', user_id: testUserId },
    { name: 'Stripe', tier: 'T2', status: 'lead', user_id: testUserId },
    { name: 'Square/Block', tier: 'T2', status: 'lead', user_id: testUserId },
    { name: 'Dodge & Cox', tier: 'T2', status: 'lead', user_id: testUserId },
    { name: 'Advent/SS&C', tier: 'T2', status: 'lead', user_id: testUserId }
  ]

  const { error } = await supabase
    .from('companies')
    .insert(companies)

  if (error) {
    console.error('Error seeding companies:', error)
  } else {
    console.log('✅ Seeded companies')
  }
}

async function seedScheduleBlocks() {
  // First, let's check if the table exists and what columns it has
  const { data: tableInfo, error: tableError } = await supabase
    .from('schedule_blocks')
    .select('*')
    .limit(1)
  
  if (tableError) {
    console.error('Error checking schedule_blocks table:', tableError)
    return
  }
  
  if (!(await checkTableEmpty('schedule_blocks'))) {
    console.log('Schedule blocks already seeded, skipping...')
    return
  }

  const blocks = [
    // Monday-Friday blocks
    { day: 1, start: '5:30 AM', end: '7:00 AM', tag: 'gym', title: 'Gym First Thing', details: 'Body split per day', user_id: testUserId },
    { day: 1, start: '6:30 AM', end: '1:00 PM', tag: 'market', title: 'Market Prep + Trading', details: 'Includes posts', user_id: testUserId },
    { day: 1, start: '1:00 PM', end: '1:30 PM', tag: 'meal', title: 'Lunch', user_id: testUserId },
    { day: 1, start: '2:00 PM', end: '3:00 PM', tag: 'study', title: 'CMT Study', user_id: testUserId },
    { day: 1, start: '3:00 PM', end: '5:00 PM', tag: 'network', title: 'Career Ops', details: 'Networking + apps', user_id: testUserId },
    { day: 1, start: '6:00 PM', end: '8:00 PM', tag: 'family', title: 'Dinner + Evening Flex', user_id: testUserId },

    // Tuesday
    { day: 2, start: '5:30 AM', end: '7:00 AM', tag: 'gym', title: 'Gym First Thing', details: 'Body split per day', user_id: testUserId },
    { day: 2, start: '6:30 AM', end: '1:00 PM', tag: 'market', title: 'Market Prep + Trading', details: 'Includes posts', user_id: testUserId },
    { day: 2, start: '1:00 PM', end: '1:30 PM', tag: 'meal', title: 'Lunch', user_id: testUserId },
    { day: 2, start: '2:00 PM', end: '3:00 PM', tag: 'study', title: 'CMT Study', user_id: testUserId },
    { day: 2, start: '3:00 PM', end: '5:00 PM', tag: 'network', title: 'Career Ops', details: 'Content + branding', user_id: testUserId },
    { day: 2, start: '6:00 PM', end: '8:00 PM', tag: 'family', title: 'Dinner + Evening Flex', user_id: testUserId },

    // Wednesday
    { day: 3, start: '5:30 AM', end: '7:00 AM', tag: 'gym', title: 'Gym First Thing', details: 'Body split per day', user_id: testUserId },
    { day: 3, start: '6:30 AM', end: '1:00 PM', tag: 'market', title: 'Market Prep + Trading', details: 'Includes posts', user_id: testUserId },
    { day: 3, start: '1:00 PM', end: '1:30 PM', tag: 'meal', title: 'Lunch', user_id: testUserId },
    { day: 3, start: '2:00 PM', end: '3:00 PM', tag: 'study', title: 'CMT Study', user_id: testUserId },
    { day: 3, start: '3:00 PM', end: '5:00 PM', tag: 'network', title: 'Career Ops', details: 'Networking + apps', user_id: testUserId },
    { day: 3, start: '6:00 PM', end: '8:00 PM', tag: 'family', title: 'Dinner + Evening Flex', user_id: testUserId },

    // Thursday
    { day: 4, start: '5:30 AM', end: '7:00 AM', tag: 'gym', title: 'Gym First Thing', details: 'Body split per day', user_id: testUserId },
    { day: 4, start: '6:30 AM', end: '1:00 PM', tag: 'market', title: 'Market Prep + Trading', details: 'Includes posts', user_id: testUserId },
    { day: 4, start: '1:00 PM', end: '1:30 PM', tag: 'meal', title: 'Lunch', user_id: testUserId },
    { day: 4, start: '2:00 PM', end: '3:00 PM', tag: 'study', title: 'CMT Study', user_id: testUserId },
    { day: 4, start: '3:00 PM', end: '5:00 PM', tag: 'network', title: 'Career Ops', details: 'Content + branding', user_id: testUserId },
    { day: 4, start: '6:00 PM', end: '8:00 PM', tag: 'family', title: 'Dinner + Evening Flex', user_id: testUserId },

    // Friday
    { day: 5, start: '5:30 AM', end: '7:00 AM', tag: 'gym', title: 'Gym First Thing', details: 'Body split per day', user_id: testUserId },
    { day: 5, start: '6:30 AM', end: '1:00 PM', tag: 'market', title: 'Market Prep + Trading', details: 'Includes posts', user_id: testUserId },
    { day: 5, start: '1:00 PM', end: '1:30 PM', tag: 'meal', title: 'Lunch', user_id: testUserId },
    { day: 5, start: '2:00 PM', end: '3:00 PM', tag: 'study', title: 'CMT Study', user_id: testUserId },
    { day: 5, start: '3:00 PM', end: '5:00 PM', tag: 'network', title: 'Career Ops', details: 'Networking + apps', user_id: testUserId },
    { day: 5, start: '6:00 PM', end: '8:00 PM', tag: 'family', title: 'Dinner + Evening Flex', user_id: testUserId },

    // Saturday
    { day: 6, start: '9:00 AM', end: '12:00 PM', tag: 'study', title: 'Major CMT Study', user_id: testUserId },
    { day: 6, start: '1:00 PM', end: '3:00 PM', tag: 'content', title: 'Legend Room / long-form content', user_id: testUserId },
    { day: 6, start: '7:00 PM', end: '10:00 PM', tag: 'family', title: 'Recharge', user_id: testUserId },

    // Sunday
    { day: 0, start: '9:00 AM', end: '11:00 AM', tag: 'market', title: 'Strategic Planning + Market Outlook', user_id: testUserId },
    { day: 0, start: '1:00 PM', end: '3:00 PM', tag: 'family', title: 'Family + Reset', user_id: testUserId }
  ]

  const { error } = await supabase
    .from('schedule_blocks')
    .insert(blocks)

  if (error) {
    console.error('Error seeding schedule blocks:', error)
  } else {
    console.log('✅ Seeded schedule blocks')
  }
}

async function seedSuccessMetrics() {
  if (!(await checkTableEmpty('success_metrics'))) {
    console.log('Success metrics already seeded, skipping...')
    return
  }

  const metrics = [
    // Phase 1 Success Metrics
    { phase: 1, area: 'Certifications & Skills', bullets: [
      'Passed SIE (Sept 6)',
      'Registered CMT Level I → Dec exam',
      'Study: 15–20 hrs/week',
      'Daily trade journal with R:R',
      'Legend Room AI documentation',
      'GitHub portfolio ready'
    ], user_id: testUserId },
    { phase: 1, area: 'Applications & Pipeline', bullets: [
      '50+ applications sent',
      '10+ first-round interviews',
      '3+ final rounds',
      '1+ offer received'
    ], user_id: testUserId },
    { phase: 1, area: 'Content & Branding', bullets: [
      '40+ LinkedIn/Twitter posts',
      'Website fully built',
      'Consistent content calendar',
      'Thought leadership established'
    ], user_id: testUserId },

    // Phase 2 Success Metrics
    { phase: 2, area: 'Job Search', bullets: [
      '60+ applications sent',
      '21+ first-round interviews',
      '7+ final rounds',
      '3+ offers received'
    ], user_id: testUserId },
    { phase: 2, area: 'CMT Progress', bullets: [
      'CMT II registration complete',
      'Study schedule maintained',
      'Practice exams passed'
    ], user_id: testUserId },

    // Phase 3 Success Metrics
    { phase: 3, area: 'Career Growth', bullets: [
      '$120K+ base salary by Dec 2027',
      '300+ meaningful connections',
      '3+ speaking engagements/articles',
      'CMT II complete'
    ], user_id: testUserId },
    { phase: 3, area: 'Industry Recognition', bullets: [
      'Thought leadership established',
      'Industry relationships built',
      'Expertise recognized'
    ], user_id: testUserId },

    // Phase 4 Success Metrics
    { phase: 4, area: 'Advanced Achievement', bullets: [
      'CMT Charter obtained',
      '$150K+ total compensation',
      '$500K+ investment portfolio',
      '$5K+/mo Legend Room revenue',
      '5+ industry recognitions'
    ], user_id: testUserId }
  ]

  const { error } = await supabase
    .from('success_metrics')
    .insert(metrics)

  if (error) {
    console.error('Error seeding success metrics:', error)
  } else {
    console.log('✅ Seeded success metrics')
  }
}

async function seedMilestones() {
  if (!(await checkTableEmpty('milestones'))) {
    console.log('Milestones already seeded, skipping...')
    return
  }

  const milestones = [
    { level: 1, name: 'Foundation Milestones', bullets: [
      'SIE exam passed',
      'CMT Level I registered',
      'First 10 applications sent',
      'LinkedIn profile optimized',
      'First coffee chat completed'
    ], user_id: testUserId },
    { level: 2, name: 'Momentum Milestones', bullets: [
      'First interview scheduled',
      'CMT Level I exam passed',
      '50+ applications sent',
      '10+ coffee chats completed',
      'Website launched'
    ], user_id: testUserId },
    { level: 3, name: 'Breakthrough Milestones', bullets: [
      'First job offer received',
      'CMT Level II registered',
      '100+ applications sent',
      '20+ interviews completed',
      'Industry recognition received'
    ], user_id: testUserId },
    { level: 4, name: 'Victory Milestones', bullets: [
      'Dream job secured',
      'CMT Charter obtained',
      'Six-figure salary achieved',
      'Legend Room revenue flowing',
      'Industry thought leader status'
    ], user_id: testUserId }
  ]

  const { error } = await supabase
    .from('milestones')
    .insert(milestones)

  if (error) {
    console.error('Error seeding milestones:', error)
  } else {
    console.log('✅ Seeded milestones')
  }
}

async function main() {
  console.log('🌱 Starting Career OS seed...')
  
  try {
    // Ensure test user exists
    testUserId = await ensureTestUser()
    if (!testUserId) {
      console.error('❌ Failed to create or find test user')
      process.exit(1)
    }
    
    console.log(`✅ Using test user ID: ${testUserId}`)
    
    await seedDailyNonNegotiables()
    await seedKPIs()
    await seedCompanies()
    await seedScheduleBlocks()
    await seedSuccessMetrics()
    await seedMilestones()
    
    console.log('🎉 Career OS seed completed successfully!')
    console.log(`📧 Test user credentials: ${TEST_USER_EMAIL} / ${TEST_USER_PASSWORD}`)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

main()

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Load plan data
const planData = JSON.parse(fs.readFileSync(path.join(__dirname, '../app/data/plan.json'), 'utf8'))

const TEST_USER_EMAIL = 'test@careeros.com'
const TEST_USER_PASSWORD = 'testpassword123'

async function createTestUser() {
  console.log('Creating test user...')
  
  // Check if user already exists
  const { data: existingUser } = await supabase.auth.admin.getUserByEmail(TEST_USER_EMAIL)
  
  if (existingUser.user) {
    console.log('Test user already exists')
    return existingUser.user.id
  }
  
  // Create user
  const { data, error } = await supabase.auth.admin.createUser({
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
    email_confirm: true
  })
  
  if (error) {
    console.error('Error creating user:', error)
    throw error
  }
  
  console.log('Test user created successfully')
  return data.user.id
}

async function seedDailyNonNegotiables(userId) {
  console.log('Seeding daily non-negotiables...')
  
  const morningTasks = planData.daily.morning.map(([item, duration], index) => ({
    user_id: userId,
    time_of_day: 'morning',
    item,
    duration_minutes: parseInt(duration.replace(/\D/g, '')) || 25,
    order_index: index
  }))
  
  const eveningTasks = planData.daily.evening.map(([item, duration], index) => ({
    user_id: userId,
    time_of_day: 'evening',
    item,
    duration_minutes: parseInt(duration.replace(/\D/g, '')) || 25,
    order_index: index
  }))
  
  const { error } = await supabase
    .from('daily_nonnegotiables')
    .upsert([...morningTasks, ...eveningTasks], { onConflict: 'user_id,time_of_day,item' })
  
  if (error) {
    console.error('Error seeding daily non-negotiables:', error)
    throw error
  }
  
  console.log(`Seeded ${morningTasks.length + eveningTasks.length} daily non-negotiables`)
}

async function seedKPIs(userId) {
  console.log('Seeding KPIs...')
  
  const kpis = planData.kpiTracker.map(kpi => ({
    user_id: userId,
    phase: 1,
    kpi_key: kpi.title.toLowerCase().replace(/\s+/g, '_'),
    label: kpi.title,
    target: kpi.goal,
    current: kpi.current,
    unit: kpi.unit
  }))
  
  const { error } = await supabase
    .from('kpis')
    .upsert(kpis, { onConflict: 'user_id,phase,kpi_key' })
  
  if (error) {
    console.error('Error seeding KPIs:', error)
    throw error
  }
  
  console.log(`Seeded ${kpis.length} KPIs`)
}

async function seedCompanies(userId) {
  console.log('Seeding companies...')
  
  const companies = []
  
  // Tier 1A companies
  planData.targets.tier1A.forEach(([name, notes]) => {
    companies.push({
      user_id: userId,
      name,
      tier: 'T1A',
      status: 'lead',
      notes
    })
  })
  
  // Tier 1B companies
  planData.targets.tier1B.forEach(([name, notes]) => {
    companies.push({
      user_id: userId,
      name,
      tier: 'T1B',
      status: 'lead',
      notes
    })
  })
  
  // Tier 2 companies
  planData.targets.tier2.forEach(([name, notes]) => {
    companies.push({
      user_id: userId,
      name,
      tier: 'T2',
      status: 'lead',
      notes
    })
  })
  
  const { error } = await supabase
    .from('companies')
    .upsert(companies, { onConflict: 'user_id,name' })
  
  if (error) {
    console.error('Error seeding companies:', error)
    throw error
  }
  
  console.log(`Seeded ${companies.length} companies`)
}

async function seedScheduleBlocks(userId) {
  console.log('Seeding schedule blocks...')
  
  const scheduleBlocks = []
  const weeklyTimed = planData.weeklyTimed
  
  const dayMap = { mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6, sun: 0 }
  
  Object.entries(weeklyTimed).forEach(([day, blocks]) => {
    if (day === 'meta') return
    
    const dayNumber = dayMap[day]
    blocks.forEach(block => {
      scheduleBlocks.push({
        user_id: userId,
        day: dayNumber,
        start: block.start,
        end: block.end,
        tag: getTagFromTitle(block.title),
        title: block.title,
        details: block.note || block.tag
      })
    })
  })
  
  const { error } = await supabase
    .from('schedule_blocks')
    .upsert(scheduleBlocks, { onConflict: 'user_id,day,start' })
  
  if (error) {
    console.error('Error seeding schedule blocks:', error)
    throw error
  }
  
  console.log(`Seeded ${scheduleBlocks.length} schedule blocks`)
}

function getTagFromTitle(title) {
  const titleLower = title.toLowerCase()
  if (titleLower.includes('gym') || titleLower.includes('workout')) return 'gym'
  if (titleLower.includes('market') || titleLower.includes('trade')) return 'market'
  if (titleLower.includes('study') || titleLower.includes('cmt')) return 'study'
  if (titleLower.includes('network') || titleLower.includes('coffee')) return 'network'
  if (titleLower.includes('content') || titleLower.includes('post')) return 'content'
  if (titleLower.includes('meal') || titleLower.includes('eat')) return 'meal'
  if (titleLower.includes('family') || titleLower.includes('date')) return 'family'
  return 'study' // default
}

async function seedSuccessMetrics(userId) {
  console.log('Seeding success metrics...')
  
  const successMetrics = []
  
  planData.phases.forEach((phase, index) => {
    phase.pillars.forEach(pillar => {
      successMetrics.push({
        user_id: userId,
        phase: index + 1,
        area: pillar.title,
        bullets: pillar.items
      })
    })
  })
  
  const { error } = await supabase
    .from('success_metrics')
    .upsert(successMetrics, { onConflict: 'user_id,phase,area' })
  
  if (error) {
    console.error('Error seeding success metrics:', error)
    throw error
  }
  
  console.log(`Seeded ${successMetrics.length} success metrics`)
}

async function seedMilestones(userId) {
  console.log('Seeding milestones...')
  
  const milestones = planData.victories.map((victory, index) => ({
    user_id: userId,
    level: index + 1,
    name: victory[0],
    bullets: victory[2] // The array of achievements
  }))
  
  const { error } = await supabase
    .from('milestones')
    .upsert(milestones, { onConflict: 'user_id,level' })
  
  if (error) {
    console.error('Error seeding milestones:', error)
    throw error
  }
  
  console.log(`Seeded ${milestones.length} milestones`)
}

async function seedUserPlan(userId) {
  console.log('Seeding user plan...')
  
  const { error } = await supabase
    .from('user_plans')
    .upsert({
      user_id: userId,
      plan_data: planData
    }, { onConflict: 'user_id' })
  
  if (error) {
    console.error('Error seeding user plan:', error)
    throw error
  }
  
  console.log('Seeded user plan')
}

async function createTodaysTasks(userId) {
  console.log('Creating today\'s tasks...')
  
  const today = new Date().toISOString().split('T')[0]
  
  // Get daily non-negotiables
  const { data: nonNegotiables } = await supabase
    .from('daily_nonnegotiables')
    .select('*')
    .eq('user_id', userId)
  
  if (!nonNegotiables) return
  
  // Create today's tasks from templates
  const todaysTasks = nonNegotiables.map(nn => ({
    user_id: userId,
    date: today,
    time_of_day: nn.time_of_day,
    item: nn.item,
    completed: false
  }))
  
  const { error } = await supabase
    .from('daily_tasks')
    .upsert(todaysTasks, { onConflict: 'user_id,date,time_of_day,item' })
  
  if (error) {
    console.error('Error creating today\'s tasks:', error)
    throw error
  }
  
  console.log(`Created ${todaysTasks.length} tasks for today`)
}

async function main() {
  try {
    console.log('Starting seed process...')
    
    const userId = await createTestUser()
    
    await seedDailyNonNegotiables(userId)
    await seedKPIs(userId)
    await seedCompanies(userId)
    await seedScheduleBlocks(userId)
    await seedSuccessMetrics(userId)
    await seedMilestones(userId)
    await seedUserPlan(userId)
    await createTodaysTasks(userId)
    
    console.log('\n✅ Seed completed successfully!')
    console.log(`Test user: ${TEST_USER_EMAIL}`)
    console.log(`Password: ${TEST_USER_PASSWORD}`)
    
    // Print record counts
    const tables = ['daily_nonnegotiables', 'daily_tasks', 'kpis', 'companies', 'schedule_blocks', 'success_metrics', 'milestones', 'user_plans']
    
    for (const table of tables) {
      const { count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
      
      console.log(`${table}: ${count} records`)
    }
    
  } catch (error) {
    console.error('Seed failed:', error)
    process.exit(1)
  }
}

main()
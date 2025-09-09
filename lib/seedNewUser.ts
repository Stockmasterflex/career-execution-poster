import { getSupabaseBrowser } from './supabase-browser'

// Types
type KPI = { phase: number; key: string; label: string; target: number; current: number }
type Company = { name: string; tier: 'T1A' | 'T1B' | 'T2'; status: 'lead' | 'applied' | 'interview' | 'offer' | 'rejected'; notes?: string }
type Block = { day: number; start: string; end: string; tag: 'gym' | 'market' | 'study' | 'network' | 'content' | 'meal' | 'family'; title: string; details?: string }
type Metric = { phase: number; area: string; bullets: string[] }
type Milestone = { level: number; name: string; bullets: string[] }

export async function seedNewUser(userId: string): Promise<boolean> {
  const supabase = getSupabaseBrowser()
  
  try {
    // Check if user already has data (look for any records)
    const { data: existingData, error: checkError } = await supabase
      .from('user_plans')
      .select('id')
      .eq('user_id', userId)
      .limit(1)
    
    if (checkError) {
      console.error('Error checking existing user data:', checkError)
      return false
    }
    
    if (existingData && existingData.length > 0) {
      console.log('User already has data, skipping seed')
      return true
    }

    // Create user plan with today's focus
    const today = new Date().toISOString().split('T')[0]
    const { error: planError } = await supabase
      .from('user_plans')
      .insert({
        user_id: userId,
        plan_data: {
          focus: {
            [today]: 'Plan week • Target research • Market prep • Networking outreach'
          }
        }
      })

    if (planError) {
      console.error('Error creating user plan:', planError)
      return false
    }

    // Seed daily non-negotiables
    const morningItems = [
      { user_id: userId, time_of_day: 'morning', item: 'Market analysis + trade journal', duration_minutes: 25, order_index: 1 },
      { user_id: userId, time_of_day: 'morning', item: 'CMT study or skill dev', duration_minutes: 25, order_index: 2 },
      { user_id: userId, time_of_day: 'morning', item: 'LinkedIn engagement + content planning', duration_minutes: 10, order_index: 3 }
    ]

    const eveningItems = [
      { user_id: userId, time_of_day: 'evening', item: 'Close review + tomorrow\'s setup', duration_minutes: 20, order_index: 1 },
      { user_id: userId, time_of_day: 'evening', item: 'Outreach or content creation', duration_minutes: 25, order_index: 2 },
      { user_id: userId, time_of_day: 'evening', item: 'Goals review + next-day plan', duration_minutes: 15, order_index: 3 }
    ]

    const { error: nonNegotiablesError } = await supabase
      .from('daily_nonnegotiables')
      .insert([...morningItems, ...eveningItems])

    if (nonNegotiablesError) {
      console.error('Error seeding daily non-negotiables:', nonNegotiablesError)
      return false
    }

    // Seed KPIs
    const kpis: KPI[] = [
      // Phase 1 KPIs (Sept–Dec 2025)
      { phase: 1, key: 'cmt_study_progress', label: 'CMT Study Progress', target: 100, current: 15 },
      { phase: 1, key: 'networking_dms', label: 'Networking DMs', target: 40, current: 3 },
      { phase: 1, key: 'coffee_chats', label: 'Coffee Chats', target: 8, current: 1 },
      { phase: 1, key: 'applications_sent', label: 'Applications Sent', target: 50, current: 3 },
      { phase: 1, key: 'linkedin_posts', label: 'LinkedIn/Twitter Posts', target: 40, current: 7 },
      { phase: 1, key: 'website_build', label: 'Website Build', target: 100, current: 25 },

      // Phase 2 KPIs (Jan–Mar 2026)
      { phase: 2, key: 'applications', label: 'Applications', target: 60, current: 0 },
      { phase: 2, key: 'interviews_first_rounds', label: 'Interviews (first rounds)', target: 21, current: 0 },
      { phase: 2, key: 'offers', label: 'Offers', target: 3, current: 0 },
      { phase: 2, key: 'cmt_ii_registration', label: 'CMT II Registration', target: 1, current: 0 },

      // Phase 3 KPIs (Mar 2026–Dec 2027)
      { phase: 3, key: 'salary', label: 'Salary (K base by Dec \'27)', target: 120, current: 0 },
      { phase: 3, key: 'network_connections', label: 'Network (meaningful connections)', target: 300, current: 0 },
      { phase: 3, key: 'recognition', label: 'Recognition (talks/articles)', target: 3, current: 0 },
      { phase: 3, key: 'cmt_ii_complete', label: 'CMT II Complete', target: 1, current: 0 },

      // Phase 4 KPIs (2028+)
      { phase: 4, key: 'cmt_charter', label: 'CMT Charter', target: 1, current: 0 },
      { phase: 4, key: 'total_compensation', label: 'Total Compensation', target: 150, current: 0 },
      { phase: 4, key: 'investment_portfolio', label: 'Investment Portfolio ($k)', target: 500, current: 0 },
      { phase: 4, key: 'legend_room_revenue', label: 'Legend Room Revenue ($/mo)', target: 5, current: 0 },
      { phase: 4, key: 'industry_recognition', label: 'Industry Recognition', target: 5, current: 0 }
    ]

    const kpisWithUserId = kpis.map(kpi => ({ ...kpi, user_id: userId }))
    const { error: kpisError } = await supabase
      .from('kpis')
      .insert(kpisWithUserId)

    if (kpisError) {
      console.error('Error seeding KPIs:', kpisError)
      return false
    }

    // Seed companies
    const companies: Company[] = [
      // T1A Companies
      { name: 'Charles Schwab', tier: 'T1A', status: 'lead' },
      { name: 'Interactive Brokers', tier: 'T1A', status: 'lead' },
      { name: 'Robinhood', tier: 'T1A', status: 'lead' },
      { name: 'Franklin Templeton', tier: 'T1A', status: 'lead' },
      { name: 'TradeStation', tier: 'T1A', status: 'lead' },

      // T1B Companies
      { name: 'Coinbase', tier: 'T1B', status: 'lead' },
      { name: 'Plaid', tier: 'T1B', status: 'lead' },
      { name: 'Tastytrade', tier: 'T1B', status: 'lead' },
      { name: 'Kraken', tier: 'T1B', status: 'lead' },
      { name: 'eToro', tier: 'T1B', status: 'lead' },

      // T2 Companies
      { name: 'Wells Fargo', tier: 'T2', status: 'lead' },
      { name: 'Stripe', tier: 'T2', status: 'lead' },
      { name: 'Square/Block', tier: 'T2', status: 'lead' },
      { name: 'Dodge & Cox', tier: 'T2', status: 'lead' },
      { name: 'Advent/SS&C', tier: 'T2', status: 'lead' }
    ]

    const companiesWithUserId = companies.map(company => ({ ...company, user_id: userId }))
    const { error: companiesError } = await supabase
      .from('companies')
      .insert(companiesWithUserId)

    if (companiesError) {
      console.error('Error seeding companies:', companiesError)
      return false
    }

    // Seed schedule blocks
    const blocks: Block[] = [
      // Monday-Friday blocks
      { day: 1, start: '5:30 AM', end: '7:00 AM', tag: 'gym', title: 'Gym First Thing', details: 'Body split per day' },
      { day: 1, start: '6:30 AM', end: '1:00 PM', tag: 'market', title: 'Market Prep + Trading', details: 'Includes posts' },
      { day: 1, start: '1:00 PM', end: '1:30 PM', tag: 'meal', title: 'Lunch' },
      { day: 1, start: '2:00 PM', end: '3:00 PM', tag: 'study', title: 'CMT Study' },
      { day: 1, start: '3:00 PM', end: '5:00 PM', tag: 'network', title: 'Career Ops', details: 'Networking + apps' },
      { day: 1, start: '6:00 PM', end: '8:00 PM', tag: 'family', title: 'Dinner + Evening Flex' },

      // Tuesday
      { day: 2, start: '5:30 AM', end: '7:00 AM', tag: 'gym', title: 'Gym First Thing', details: 'Body split per day' },
      { day: 2, start: '6:30 AM', end: '1:00 PM', tag: 'market', title: 'Market Prep + Trading', details: 'Includes posts' },
      { day: 2, start: '1:00 PM', end: '1:30 PM', tag: 'meal', title: 'Lunch' },
      { day: 2, start: '2:00 PM', end: '3:00 PM', tag: 'study', title: 'CMT Study' },
      { day: 2, start: '3:00 PM', end: '5:00 PM', tag: 'network', title: 'Career Ops', details: 'Content + branding' },
      { day: 2, start: '6:00 PM', end: '8:00 PM', tag: 'family', title: 'Dinner + Evening Flex' },

      // Wednesday
      { day: 3, start: '5:30 AM', end: '7:00 AM', tag: 'gym', title: 'Gym First Thing', details: 'Body split per day' },
      { day: 3, start: '6:30 AM', end: '1:00 PM', tag: 'market', title: 'Market Prep + Trading', details: 'Includes posts' },
      { day: 3, start: '1:00 PM', end: '1:30 PM', tag: 'meal', title: 'Lunch' },
      { day: 3, start: '2:00 PM', end: '3:00 PM', tag: 'study', title: 'CMT Study' },
      { day: 3, start: '3:00 PM', end: '5:00 PM', tag: 'network', title: 'Career Ops', details: 'Networking + apps' },
      { day: 3, start: '6:00 PM', end: '8:00 PM', tag: 'family', title: 'Dinner + Evening Flex' },

      // Thursday
      { day: 4, start: '5:30 AM', end: '7:00 AM', tag: 'gym', title: 'Gym First Thing', details: 'Body split per day' },
      { day: 4, start: '6:30 AM', end: '1:00 PM', tag: 'market', title: 'Market Prep + Trading', details: 'Includes posts' },
      { day: 4, start: '1:00 PM', end: '1:30 PM', tag: 'meal', title: 'Lunch' },
      { day: 4, start: '2:00 PM', end: '3:00 PM', tag: 'study', title: 'CMT Study' },
      { day: 4, start: '3:00 PM', end: '5:00 PM', tag: 'network', title: 'Career Ops', details: 'Content + branding' },
      { day: 4, start: '6:00 PM', end: '8:00 PM', tag: 'family', title: 'Dinner + Evening Flex' },

      // Friday
      { day: 5, start: '5:30 AM', end: '7:00 AM', tag: 'gym', title: 'Gym First Thing', details: 'Body split per day' },
      { day: 5, start: '6:30 AM', end: '1:00 PM', tag: 'market', title: 'Market Prep + Trading', details: 'Includes posts' },
      { day: 5, start: '1:00 PM', end: '1:30 PM', tag: 'meal', title: 'Lunch' },
      { day: 5, start: '2:00 PM', end: '3:00 PM', tag: 'study', title: 'CMT Study' },
      { day: 5, start: '3:00 PM', end: '5:00 PM', tag: 'network', title: 'Career Ops', details: 'Networking + apps' },
      { day: 5, start: '6:00 PM', end: '8:00 PM', tag: 'family', title: 'Dinner + Evening Flex' },

      // Saturday
      { day: 6, start: '9:00 AM', end: '12:00 PM', tag: 'study', title: 'Major CMT Study' },
      { day: 6, start: '1:00 PM', end: '3:00 PM', tag: 'content', title: 'Legend Room / long-form content' },
      { day: 6, start: '7:00 PM', end: '10:00 PM', tag: 'family', title: 'Recharge' },

      // Sunday
      { day: 0, start: '9:00 AM', end: '11:00 AM', tag: 'market', title: 'Strategic Planning + Market Outlook' },
      { day: 0, start: '1:00 PM', end: '3:00 PM', tag: 'family', title: 'Family + Reset' }
    ]

    const blocksWithUserId = blocks.map(block => ({ ...block, user_id: userId }))
    const { error: blocksError } = await supabase
      .from('schedule_blocks')
      .insert(blocksWithUserId)

    if (blocksError) {
      console.error('Error seeding schedule blocks:', blocksError)
      return false
    }

    // Seed success metrics
    const metrics: Metric[] = [
      // Phase 1 Success Metrics
      { phase: 1, area: 'Certifications & Skills', bullets: [
        'Passed SIE (Sept 6)',
        'Registered CMT Level I → Dec exam',
        'Study: 15–20 hrs/week',
        'Daily trade journal with R:R',
        'Legend Room AI documentation',
        'GitHub portfolio ready'
      ]},
      { phase: 1, area: 'Applications & Pipeline', bullets: [
        '50+ applications sent',
        '10+ first-round interviews',
        '3+ final rounds',
        '1+ offer received'
      ]},
      { phase: 1, area: 'Content & Branding', bullets: [
        '40+ LinkedIn/Twitter posts',
        'Website fully built',
        'Consistent content calendar',
        'Thought leadership established'
      ]},

      // Phase 2 Success Metrics
      { phase: 2, area: 'Job Search', bullets: [
        '60+ applications sent',
        '21+ first-round interviews',
        '7+ final rounds',
        '3+ offers received'
      ]},
      { phase: 2, area: 'CMT Progress', bullets: [
        'CMT II registration complete',
        'Study schedule maintained',
        'Practice exams passed'
      ]},

      // Phase 3 Success Metrics
      { phase: 3, area: 'Career Growth', bullets: [
        '$120K+ base salary by Dec 2027',
        '300+ meaningful connections',
        '3+ speaking engagements/articles',
        'CMT II complete'
      ]},
      { phase: 3, area: 'Industry Recognition', bullets: [
        'Thought leadership established',
        'Industry relationships built',
        'Expertise recognized'
      ]},

      // Phase 4 Success Metrics
      { phase: 4, area: 'Advanced Achievement', bullets: [
        'CMT Charter obtained',
        '$150K+ total compensation',
        '$500K+ investment portfolio',
        '$5K+/mo Legend Room revenue',
        '5+ industry recognitions'
      ]}
    ]

    const metricsWithUserId = metrics.map(metric => ({ ...metric, user_id: userId }))
    const { error: metricsError } = await supabase
      .from('success_metrics')
      .insert(metricsWithUserId)

    if (metricsError) {
      console.error('Error seeding success metrics:', metricsError)
      return false
    }

    // Seed milestones
    const milestones: Milestone[] = [
      { level: 1, name: 'Foundation Milestones', bullets: [
        'SIE exam passed',
        'CMT Level I registered',
        'First 10 applications sent',
        'LinkedIn profile optimized',
        'First coffee chat completed'
      ]},
      { level: 2, name: 'Momentum Milestones', bullets: [
        'First interview scheduled',
        'CMT Level I exam passed',
        '50+ applications sent',
        '10+ coffee chats completed',
        'Website launched'
      ]},
      { level: 3, name: 'Breakthrough Milestones', bullets: [
        'First job offer received',
        'CMT Level II registered',
        '100+ applications sent',
        '20+ interviews completed',
        'Industry recognition received'
      ]},
      { level: 4, name: 'Victory Milestones', bullets: [
        'Dream job secured',
        'CMT Charter obtained',
        'Six-figure salary achieved',
        'Legend Room revenue flowing',
        'Industry thought leader status'
      ]}
    ]

    const milestonesWithUserId = milestones.map(milestone => ({ ...milestone, user_id: userId }))
    const { error: milestonesError } = await supabase
      .from('milestones')
      .insert(milestonesWithUserId)

    if (milestonesError) {
      console.error('Error seeding milestones:', milestonesError)
      return false
    }

    console.log('✅ Successfully seeded new user data')
    return true

  } catch (error) {
    console.error('Error seeding new user:', error)
    return false
  }
}

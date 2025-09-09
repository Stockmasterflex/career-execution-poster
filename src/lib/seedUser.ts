'use client'

import { focusRepo } from '@/src/data/focus'
import { nonNegotiablesRepo } from '@/src/data/nonnegotiables'
import { scheduleRepo } from '@/src/data/schedule'
import { kpiRepo } from '@/src/data/kpis'
import { companiesRepo } from '@/src/data/companies'

export function seedUserData() {
  if (typeof window === 'undefined') return
  
  // Check if already seeded
  const seeded = localStorage.getItem('career_os_seeded')
  if (seeded === 'true') return
  
  // Seed focus items from career plan
  const focusItems = [
    { id: '1', text: 'Complete CMT study session (1 hour)', completed: false },
    { id: '2', text: 'Update LinkedIn with market analysis', completed: false },
    { id: '3', text: 'Research target companies for applications', completed: false },
    { id: '4', text: 'Prepare for coffee chat with Schwab contact', completed: false },
    { id: '5', text: 'Update trade journal with today\'s setups', completed: false }
  ]
  localStorage.setItem('career_os_focus', JSON.stringify(focusItems))

  // Seed non-negotiables from career plan
  const nonNegotiables = {
    date: new Date().toISOString().split('T')[0],
    morning: {
      name: 'Morning Power Hour (60 min)',
      tasks: [
        { id: '1', text: 'Market analysis + trade journal update (25 min)', completed: false, duration: '25 min' },
        { id: '2', text: 'CMT study or skill development (25 min)', completed: false, duration: '25 min' },
        { id: '3', text: 'LinkedIn engagement + content planning (10 min)', completed: false, duration: '10 min' }
      ]
    },
    evening: {
      name: 'Evening Power Hour (60 min)',
      tasks: [
        { id: '1', text: 'Close review + tomorrow\'s setup (20 min)', completed: false, duration: '20 min' },
        { id: '2', text: 'Outreach or content creation (25 min)', completed: false, duration: '25 min' },
        { id: '3', text: 'Goals review + next-day planning (15 min)', completed: false, duration: '15 min' }
      ]
    },
    morningCompleted: false,
    eveningCompleted: false,
    streak: 3
  }
  localStorage.setItem('career_os_nonnegotiables', JSON.stringify(nonNegotiables))

  // Seed KPIs from career plan Phase 1
  const kpis = [
    { id: 'cmt-study', name: 'CMT Study Progress', current: 12, target: 35, phase: 1 },
    { id: 'networking-dms', name: 'Networking DMs', current: 3, target: 40, phase: 1 },
    { id: 'coffee-chats', name: 'Coffee Chats', current: 1, target: 8, phase: 1 },
    { id: 'applications', name: 'Applications Sent', current: 3, target: 50, phase: 1 },
    { id: 'linkedin-posts', name: 'LinkedIn/Twitter Posts', current: 7, target: 40, phase: 1 },
    { id: 'website-build', name: 'Website Build', current: 25, target: 100, phase: 1 }
  ]
  localStorage.setItem('career_os_kpis', JSON.stringify(kpis))

  // Seed companies from career plan
  const companies = [
    // Tier 1A - Highest Success Probability
    { id: '1', name: 'Charles Schwab', tier: 'T1A', status: 'Lead', notes: 'SF HQ - Trading operations, research, technology' },
    { id: '2', name: 'Interactive Brokers', tier: 'T1A', status: 'Applied', notes: 'Technical analysis, platform operations, client services' },
    { id: '3', name: 'Robinhood', tier: 'T1A', status: 'Lead', notes: 'Menlo Park - Product analysis, trading operations, market research' },
    { id: '4', name: 'Franklin Templeton', tier: 'T1A', status: 'Lead', notes: 'SF - Investment research, portfolio management' },
    { id: '5', name: 'TradeStation', tier: 'T1A', status: 'Lead', notes: 'Platform support, market analysis, technical research' },
    
    // Tier 1B - FinTech/Tech-Finance
    { id: '6', name: 'Coinbase', tier: 'T1B', status: 'Lead', notes: 'SF - Market research, institutional services, trading operations' },
    { id: '7', name: 'Plaid', tier: 'T1B', status: 'Lead', notes: 'SF - Financial data analysis, partnerships, product analytics' },
    { id: '8', name: 'Tastytrade', tier: 'T1B', status: 'Lead', notes: 'Market research, content creation, platform analytics' },
    { id: '9', name: 'Kraken', tier: 'T1B', status: 'Lead', notes: 'SF - Market analysis, institutional trading, research' },
    { id: '10', name: 'eToro', tier: 'T1B', status: 'Lead', notes: 'Platform research, market analysis, trader education' },
    
    // Tier 2 - Expanding Opportunities
    { id: '11', name: 'Wells Fargo', tier: 'T2', status: 'Lead', notes: 'SF - Investment banking technology, asset management' },
    { id: '12', name: 'Stripe', tier: 'T2', status: 'Lead', notes: 'SF - Financial operations, risk analysis, data science' },
    { id: '13', name: 'Square/Block', tier: 'T2', status: 'Lead', notes: 'SF - Financial analytics, trading technology' },
    { id: '14', name: 'Dodge & Cox', tier: 'T2', status: 'Lead', notes: 'SF - Equity research, quantitative analysis' },
    { id: '15', name: 'Advent/SS&C', tier: 'T2', status: 'Lead', notes: 'Client solutions, technical support, implementation' }
  ]
  localStorage.setItem('career_os_companies', JSON.stringify(companies))

  // Seed weekly schedule from calendar image
  const schedule = {
    'MON': {
      '6:00 AM': { id: 'monday-gym', title: '🏋️ Gym: Chest + Triceps', color: 'time-gym', done: false },
      '7:00 AM': { id: 'monday-breakfast', title: '🍳 Breakfast + Shower', color: 'time-meals', done: false },
      '8:00 AM': { id: 'monday-prep', title: '📊 Pre-Market Analysis', color: 'time-market', done: false },
      '9:00 AM': { id: 'monday-trading', title: '📈 Market Open + Early Trades', color: 'time-market', done: false },
      '1:00 PM': { id: 'monday-close', title: '📊 Market Close + Final Journal', color: 'time-planning', done: false },
      '2:00 PM': { id: 'monday-study', title: '📚 CMT Study (1 hr)', color: 'time-study', done: false },
      '6:00 PM': { id: 'monday-dinner', title: '🍽️ Dinner + Family Time', color: 'time-family', done: false },
      '10:00 PM': { id: 'monday-sleep', title: '😴 Sleep Time (8+ hours)', color: 'time-meals', done: false }
    },
    'TUE': {
      '6:00 AM': { id: 'tuesday-gym', title: '🏋️ Gym: Back + Biceps', color: 'time-gym', done: false },
      '7:00 AM': { id: 'tuesday-breakfast', title: '🍳 Breakfast + Shower', color: 'time-meals', done: false },
      '8:00 AM': { id: 'tuesday-prep', title: '📊 Market Prep + Research', color: 'time-market', done: false },
      '9:00 AM': { id: 'tuesday-trading', title: '📈 Market Open + Trading', color: 'time-market', done: false },
      '1:00 PM': { id: 'tuesday-close', title: '📊 Market Close + Final Journal', color: 'time-planning', done: false },
      '2:00 PM': { id: 'tuesday-study', title: '📚 Deep CMT Session', color: 'time-study', done: false },
      '6:00 PM': { id: 'tuesday-dinner', title: '🍽️ Dinner + Family Time', color: 'time-family', done: false },
      '10:00 PM': { id: 'tuesday-sleep', title: '😴 Sleep Time (8+ hours)', color: 'time-meals', done: false }
    },
    'WED': {
      '6:00 AM': { id: 'wednesday-gym', title: '🏋️ Gym: Core + Cardio', color: 'time-gym', done: false },
      '7:00 AM': { id: 'wednesday-breakfast', title: '🍳 Breakfast + Shower', color: 'time-meals', done: false },
      '8:00 AM': { id: 'wednesday-prep', title: '📊 Pre-Market Scan', color: 'time-market', done: false },
      '9:00 AM': { id: 'wednesday-trading', title: '📈 Market Open + Trading', color: 'time-market', done: false },
      '1:00 PM': { id: 'wednesday-close', title: '📊 Market Close + Final Journal', color: 'time-planning', done: false },
      '2:00 PM': { id: 'wednesday-study', title: '📚 CMT Study (1 hr)', color: 'time-study', done: false },
      '6:00 PM': { id: 'wednesday-dinner', title: '🍽️ Dinner + Family Time', color: 'time-family', done: false },
      '10:00 PM': { id: 'wednesday-sleep', title: '😴 Sleep Time (8+ hours)', color: 'time-meals', done: false }
    },
    'THU': {
      '6:00 AM': { id: 'thursday-gym', title: '🏋️ Gym: Shoulders + Arms', color: 'time-gym', done: false },
      '7:00 AM': { id: 'thursday-breakfast', title: '🍳 Breakfast + Shower', color: 'time-meals', done: false },
      '8:00 AM': { id: 'thursday-prep', title: '📊 Market Setups', color: 'time-market', done: false },
      '9:00 AM': { id: 'thursday-trading', title: '📈 Market Open + Trading', color: 'time-market', done: false },
      '1:00 PM': { id: 'thursday-close', title: '📊 Market Close + Final Journal', color: 'time-planning', done: false },
      '2:00 PM': { id: 'thursday-study', title: '📚 CMT Study (1 hr)', color: 'time-study', done: false },
      '6:00 PM': { id: 'thursday-dinner', title: '🍽️ Dinner + Family Time', color: 'time-family', done: false },
      '10:00 PM': { id: 'thursday-sleep', title: '😴 Sleep Time (8+ hours)', color: 'time-meals', done: false }
    },
    'FRI': {
      '6:00 AM': { id: 'friday-gym', title: '🏋️ Gym: Legs + Glutes', color: 'time-gym', done: false },
      '7:00 AM': { id: 'friday-breakfast', title: '🍳 Breakfast + Shower', color: 'time-meals', done: false },
      '8:00 AM': { id: 'friday-prep', title: '📊 Weekly Prep', color: 'time-market', done: false },
      '9:00 AM': { id: 'friday-trading', title: '📈 Market Open + Trading', color: 'time-market', done: false },
      '1:00 PM': { id: 'friday-close', title: '📊 Weekly Review', color: 'time-planning', done: false },
      '2:00 PM': { id: 'friday-study', title: '📚 CMT Study (1 hr)', color: 'time-study', done: false },
      '6:00 PM': { id: 'friday-dinner', title: '🍽️ Dinner + Family Time', color: 'time-family', done: false },
      '10:00 PM': { id: 'friday-sleep', title: '😴 Sleep Time (8+ hours)', color: 'time-meals', done: false }
    },
    'SAT': {
      '6:00 AM': { id: 'saturday-morning', title: '☕ Slow Morning', color: 'time-family', done: false },
      '7:00 AM': { id: 'saturday-breakfast', title: '🍳 Leisurely Breakfast', color: 'time-meals', done: false },
      '8:00 AM': { id: 'saturday-study', title: '📚 Weekend CMT Study', color: 'time-study', done: false },
      '9:00 AM': { id: 'saturday-dev', title: '🤖 Legend Room Dev', color: 'time-content', done: false },
      '1:00 PM': { id: 'saturday-coffee', title: '☕ Coffee/Walk', color: 'time-family', done: false },
      '2:00 PM': { id: 'saturday-major', title: '📚 Major CMT Block', color: 'time-study', done: false },
      '6:00 PM': { id: 'saturday-date', title: '💕 Date Night', color: 'time-family', done: false },
      '10:00 PM': { id: 'saturday-sleep', title: '😴 Bedtime', color: 'time-meals', done: false }
    },
    'SUN': {
      '6:00 AM': { id: 'sunday-sleep', title: '😴 Sleep In', color: 'time-family', done: false },
      '7:00 AM': { id: 'sunday-brunch', title: '🍳 Brunch Prep', color: 'time-meals', done: false },
      '8:00 AM': { id: 'sunday-planning', title: '📋 Week Planning', color: 'time-planning', done: false },
      '9:00 AM': { id: 'sunday-wife', title: '👫 Time with Wife', color: 'time-family', done: false },
      '1:00 PM': { id: 'sunday-reset', title: '🔄 Reset', color: 'time-family', done: false },
      '2:00 PM': { id: 'sunday-analysis', title: '📊 Market Analysis', color: 'time-market', done: false },
      '6:00 PM': { id: 'sunday-family', title: '👨‍👩‍👧‍👦 Family Time', color: 'time-family', done: false },
      '10:00 PM': { id: 'sunday-sleep', title: '😴 Bedtime', color: 'time-meals', done: false }
    }
  }
  localStorage.setItem('career_os_schedule', JSON.stringify(schedule))
  
  // Mark as seeded
  localStorage.setItem('career_os_seeded', 'true')
  
  console.log('Career OS data seeded successfully!')
}

export function resetUserData() {
  if (typeof window === 'undefined') return
  
  // Clear all data
  localStorage.removeItem('career_os_focus')
  localStorage.removeItem('career_os_nonnegotiables')
  localStorage.removeItem('career_os_schedule')
  localStorage.removeItem('career_os_kpis')
  localStorage.removeItem('career_os_companies')
  localStorage.removeItem('career_os_seeded')
  
  // Re-seed
  seedUserData()
}
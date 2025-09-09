'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ensureBootstrap } from '@/lib/ensureBootstrap'

interface DailyNonNegotiable {
  id: string
  time_of_day: 'morning' | 'evening'
  item: string
  order_index: number
}

interface DailyTask {
  id: string
  item_id: string
  completed: boolean
}

interface DailyNonNegotiablesProps {
  userId: string
}

export default function DailyNonNegotiables({ userId }: DailyNonNegotiablesProps) {
  const [morningItems, setMorningItems] = useState<DailyNonNegotiable[]>([])
  const [eveningItems, setEveningItems] = useState<DailyNonNegotiable[]>([])
  const [morningTasks, setMorningTasks] = useState<DailyTask[]>([])
  const [eveningTasks, setEveningTasks] = useState<DailyTask[]>([])
  const [morningStreak, setMorningStreak] = useState(0)
  const [eveningStreak, setEveningStreak] = useState(0)
  const [loading, setLoading] = useState(true)
  const [today] = useState(new Date().toISOString().split('T')[0])

  const loadData = async () => {
    try {
      console.log('[NONNEGO] Loading data for user:', userId)
      
      // Load non-negotiables
      const { data: nonnegotiables, error: nonnegotiablesError } = await supabase
        .from('daily_nonnegotiables')
        .select('*')
        .eq('user_id', userId)
        .order('time_of_day', { ascending: true })
        .order('order_index', { ascending: true })

      if (nonnegotiablesError) {
        console.error('[NONNEGO] Error loading nonnegotiables:', nonnegotiablesError)
        return
      }

      if (!nonnegotiables || nonnegotiables.length === 0) {
        console.log('[NONNEGO] No nonnegotiables found, running bootstrap...')
        const result = await ensureBootstrap(supabase)
        if (result.seeded) {
          // Reload data after bootstrap
          await loadData()
          return
        }
      }

      const morning = nonnegotiables?.filter(item => item.time_of_day === 'morning') || []
      const evening = nonnegotiables?.filter(item => item.time_of_day === 'evening') || []

      setMorningItems(morning)
      setEveningItems(evening)

      // Load today's tasks
      const { data: tasks, error: tasksError } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)

      if (tasksError) {
        console.error('[NONNEGO] Error loading tasks:', tasksError)
        return
      }

      const morningTaskMap = new Map(tasks?.filter(task => 
        morning.some(item => item.id === task.item_id)
      ).map(task => [task.item_id, task]) || [])

      const eveningTaskMap = new Map(tasks?.filter(task => 
        evening.some(item => item.id === task.item_id)
      ).map(task => [task.item_id, task]) || [])

      setMorningTasks(Array.from(morningTaskMap.values()))
      setEveningTasks(Array.from(eveningTaskMap.values()))

      // Calculate streaks
      await calculateStreaks(userId, morning, evening)

    } catch (error) {
      console.error('[NONNEGO] Error in loadData:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStreaks = async (userId: string, morningItems: DailyNonNegotiable[], eveningItems: DailyNonNegotiable[]) => {
    try {
      // Get last 30 days of tasks
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const startDate = thirtyDaysAgo.toISOString().split('T')[0]

      const { data: allTasks, error } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate)
        .order('date', { ascending: false })

      if (error) {
        console.error('[NONNEGO] Error calculating streaks:', error)
        return
      }

      // Calculate morning streak
      let morningStreakCount = 0
      const morningItemIds = morningItems.map(item => item.id)
      
      for (const task of allTasks || []) {
        if (morningItemIds.includes(task.item_id)) {
          const dayTasks = allTasks?.filter(t => t.date === task.date && morningItemIds.includes(t.item_id)) || []
          const completedCount = dayTasks.filter(t => t.completed).length
          
          if (completedCount === morningItemIds.length) {
            morningStreakCount++
          } else {
            break
          }
        }
      }

      // Calculate evening streak
      let eveningStreakCount = 0
      const eveningItemIds = eveningItems.map(item => item.id)
      
      for (const task of allTasks || []) {
        if (eveningItemIds.includes(task.item_id)) {
          const dayTasks = allTasks?.filter(t => t.date === task.date && eveningItemIds.includes(t.item_id)) || []
          const completedCount = dayTasks.filter(t => t.completed).length
          
          if (completedCount === eveningItemIds.length) {
            eveningStreakCount++
          } else {
            break
          }
        }
      }

      setMorningStreak(morningStreakCount)
      setEveningStreak(eveningStreakCount)

    } catch (error) {
      console.error('[NONNEGO] Error calculating streaks:', error)
    }
  }

  const toggleTask = async (itemId: string, completed: boolean) => {
    try {
      if (completed) {
        // Create new task
        const { error } = await supabase
          .from('daily_tasks')
          .insert({
            user_id: userId,
            date: today,
            item_id: itemId,
            completed: true
          })

        if (error) {
          console.error('[NONNEGO] Error creating task:', error)
          return
        }
      } else {
        // Delete task
        const { error } = await supabase
          .from('daily_tasks')
          .delete()
          .eq('user_id', userId)
          .eq('date', today)
          .eq('item_id', itemId)

        if (error) {
          console.error('[NONNEGO] Error deleting task:', error)
          return
        }
      }

      // Reload data
      await loadData()
    } catch (error) {
      console.error('[NONNEGO] Error toggling task:', error)
    }
  }

  const handleQuickAddDefaults = async () => {
    try {
      console.log('[NONNEGO] Running bootstrap for quick add...')
      const result = await ensureBootstrap(supabase)
      if (result.seeded) {
        await loadData()
      }
    } catch (error) {
      console.error('[NONNEGO] Error in quick add defaults:', error)
    }
  }

  useEffect(() => {
    if (userId) {
      loadData()
    }
  }, [userId])

  if (loading) {
    return <div className="p-4">Loading daily non-negotiables...</div>
  }

  const isTaskCompleted = (itemId: string, tasks: DailyTask[]) => {
    return tasks.some(task => task.item_id === itemId && task.completed)
  }

  const renderItemList = (items: DailyNonNegotiable[], tasks: DailyTask[], streak: number, title: string) => (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">🔥 {streak}-day streak</span>
          {items.length === 0 && (
            <button
              onClick={handleQuickAddDefaults}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              Quick add defaults
            </button>
          )}
        </div>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <label key={item.id} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isTaskCompleted(item.id, tasks)}
              onChange={(e) => toggleTask(item.id, e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700">{item.item}</span>
          </label>
        ))}
        {items.length === 0 && (
          <p className="text-gray-500 text-sm">No items yet. Click "Quick add defaults" to get started.</p>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Daily Non-Negotiables</h2>
      {renderItemList(morningItems, morningTasks, morningStreak, 'Morning')}
      {renderItemList(eveningItems, eveningTasks, eveningStreak, 'Evening')}
    </div>
  )
}
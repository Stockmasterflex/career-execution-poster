'use client'

import { useState, useEffect } from 'react'
import { Plus, Check, Edit2, Trash2, Flame } from 'lucide-react'
import { createClient } from '@/lib/supabase-browser'
import type { Database } from '@/lib/database.types'

type NonNegotiable = Database['public']['Tables']['daily_nonnegotiables']['Row']

const MORNING_TASKS = [
  'Market analysis + trade journal (25m)',
  'CMT study/skill dev (25m)',
  'LinkedIn engagement + content planning (10m)',
]

const EVENING_TASKS = [
  'Close review + tomorrow\'s setup (20m)',
  'Outreach or content creation (25m)',
  'Goals review + next-day plan (15m)',
]

interface DailyNonNegotiablesProps {
  userId: string
}

export default function DailyNonNegotiables({ userId }: DailyNonNegotiablesProps) {
  const [morningTasks, setMorningTasks] = useState<NonNegotiable[]>([])
  const [eveningTasks, setEveningTasks] = useState<NonNegotiable[]>([])
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set())
  const [morningStreak, setMorningStreak] = useState(0)
  const [eveningStreak, setEveningStreak] = useState(0)
  const [loading, setLoading] = useState(true)
  const [editingTask, setEditingTask] = useState<NonNegotiable | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const supabase = createClient()

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    loadTasks()
    loadCompletedTasks()
    loadStreaks()
  }, [userId, today])

  const loadTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_nonnegotiables')
        .select('*')
        .eq('user_id', userId)
        .order('order_index')

      if (error) throw error

      const morning = data?.filter(task => task.type === 'morning') || []
      const evening = data?.filter(task => task.type === 'evening') || []

      setMorningTasks(morning)
      setEveningTasks(evening)

      // Seed default tasks if none exist
      if (data?.length === 0) {
        await seedDefaultTasks()
      }
    } catch (error) {
      console.error('Error loading tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const seedDefaultTasks = async () => {
    try {
      const tasks = [
        ...MORNING_TASKS.map((title, index) => ({
          user_id: userId,
          title,
          type: 'morning' as const,
          order_index: index,
        })),
        ...EVENING_TASKS.map((title, index) => ({
          user_id: userId,
          title,
          type: 'evening' as const,
          order_index: index,
        })),
      ]

      const { error } = await supabase
        .from('daily_nonnegotiables')
        .insert(tasks)

      if (error) throw error
      await loadTasks()
    } catch (error) {
      console.error('Error seeding default tasks:', error)
    }
  }

  const loadCompletedTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_tasks')
        .select('task_id')
        .eq('user_id', userId)
        .eq('date', today)
        .not('completed_at', 'is', null)

      if (error) throw error
      setCompletedTasks(new Set(data?.map(task => task.task_id) || []))
    } catch (error) {
      console.error('Error loading completed tasks:', error)
    }
  }

  const loadStreaks = async () => {
    try {
      // Calculate morning streak
      const { data: morningData } = await supabase
        .from('daily_tasks')
        .select('date')
        .eq('user_id', userId)
        .in('task_id', morningTasks.map(t => t.id))
        .not('completed_at', 'is', null)
        .order('date', { ascending: false })

      // Calculate evening streak
      const { data: eveningData } = await supabase
        .from('daily_tasks')
        .select('date')
        .eq('user_id', userId)
        .in('task_id', eveningTasks.map(t => t.id))
        .not('completed_at', 'is', null)
        .order('date', { ascending: false })

      // Simple streak calculation (consecutive days with all tasks completed)
      setMorningStreak(calculateStreak(morningData || []))
      setEveningStreak(calculateStreak(eveningData || []))
    } catch (error) {
      console.error('Error loading streaks:', error)
    }
  }

  const calculateStreak = (completedData: { date: string }[]) => {
    if (completedData.length === 0) return 0

    const dates = [...new Set(completedData.map(d => d.date))].sort((a, b) => b.localeCompare(a))
    let streak = 0
    const today = new Date().toISOString().split('T')[0]

    for (let i = 0; i < dates.length; i++) {
      const currentDate = new Date(dates[i])
      const expectedDate = new Date(today)
      expectedDate.setDate(expectedDate.getDate() - i)

      if (dates[i] === expectedDate.toISOString().split('T')[0]) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  const toggleTaskCompletion = async (taskId: string) => {
    try {
      const isCompleted = completedTasks.has(taskId)

      if (isCompleted) {
        // Mark as incomplete
        const { error } = await supabase
          .from('daily_tasks')
          .update({ completed_at: null })
          .eq('user_id', userId)
          .eq('task_id', taskId)
          .eq('date', today)

        if (error) throw error
      } else {
        // Mark as complete
        const { error } = await supabase
          .from('daily_tasks')
          .upsert({
            user_id: userId,
            task_id: taskId,
            date: today,
            completed_at: new Date().toISOString(),
          })

        if (error) throw error
      }

      setCompletedTasks(prev => {
        const newSet = new Set(prev)
        if (isCompleted) {
          newSet.delete(taskId)
        } else {
          newSet.add(taskId)
        }
        return newSet
      })

      await loadStreaks()
    } catch (error) {
      console.error('Error toggling task completion:', error)
    }
  }

  const addTask = async (type: 'morning' | 'evening') => {
    if (!newTaskTitle.trim()) return

    try {
      const tasks = type === 'morning' ? morningTasks : eveningTasks
      const { error } = await supabase
        .from('daily_nonnegotiables')
        .insert({
          user_id: userId,
          title: newTaskTitle.trim(),
          type,
          order_index: tasks.length,
        })

      if (error) throw error
      setNewTaskTitle('')
      await loadTasks()
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  const updateTask = async (taskId: string, title: string) => {
    try {
      const { error } = await supabase
        .from('daily_nonnegotiables')
        .update({ title })
        .eq('id', taskId)

      if (error) throw error
      setEditingTask(null)
      await loadTasks()
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('daily_nonnegotiables')
        .delete()
        .eq('id', taskId)

      if (error) throw error
      await loadTasks()
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const TaskList = ({ tasks, type, streak }: { tasks: NonNegotiable[], type: 'morning' | 'evening', streak: number }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-card-title font-medium text-white capitalize">{type} Tasks</h3>
        <div className="flex items-center space-x-1 text-xs text-purple-400">
          <Flame className="h-3 w-3" />
          <span>{streak} day streak</span>
        </div>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center space-x-3 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <button
              onClick={() => toggleTaskCompletion(task.id)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                completedTasks.has(task.id)
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-400 hover:border-green-400'
              }`}
            >
              {completedTasks.has(task.id) && <Check className="h-3 w-3" />}
            </button>

            {editingTask?.id === task.id ? (
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onBlur={() => {
                  if (newTaskTitle.trim()) {
                    updateTask(task.id, newTaskTitle.trim())
                  } else {
                    setEditingTask(null)
                    setNewTaskTitle('')
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (newTaskTitle.trim()) {
                      updateTask(task.id, newTaskTitle.trim())
                    }
                  } else if (e.key === 'Escape') {
                    setEditingTask(null)
                    setNewTaskTitle('')
                  }
                }}
                className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                autoFocus
              />
            ) : (
              <span className={`flex-1 text-sm ${completedTasks.has(task.id) ? 'line-through text-gray-400' : 'text-white'}`}>
                {task.title}
              </span>
            )}

            <div className="flex items-center space-x-1">
              <button
                onClick={() => {
                  setEditingTask(task)
                  setNewTaskTitle(task.title)
                }}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <Edit2 className="h-3 w-3" />
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="p-1 text-gray-400 hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newTaskTitle.trim()) {
                addTask(type)
              }
            }}
            placeholder={`Add ${type} task...`}
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <button
            onClick={() => addTask(type)}
            disabled={!newTaskTitle.trim()}
            className="p-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="bg-card-bg backdrop-blur-glass border border-border rounded-glass p-6 shadow-card">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded"></div>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card-bg backdrop-blur-glass border border-border rounded-glass p-6 shadow-card">
      <h2 className="text-section-title font-semibold text-white mb-6">Daily Non-Negotiables</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TaskList tasks={morningTasks} type="morning" streak={morningStreak} />
        <TaskList tasks={eveningTasks} type="evening" streak={eveningStreak} />
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Checkbox } from '@/components/ui/Checkbox'

interface Task {
  id: string
  item: string
  completed: boolean
  time_of_day: 'morning' | 'evening'
}

export function DailyNonNegotiables() {
  const [morningTasks, setMorningTasks] = useState<Task[]>([])
  const [eveningTasks, setEveningTasks] = useState<Task[]>([])
  const [morningStreak, setMorningStreak] = useState(0)
  const [eveningStreak, setEveningStreak] = useState(0)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadTodaysTasks()
  }, [])

  const loadTodaysTasks = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      // Load today's tasks
      const { data: tasks, error } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('date', today)
        .order('time_of_day')

      if (error) throw error

      if (!tasks || tasks.length === 0) {
        // Create today's tasks from templates
        await createTodaysTasks()
        return
      }

      const morning = tasks.filter(t => t.time_of_day === 'morning')
      const evening = tasks.filter(t => t.time_of_day === 'evening')
      
      setMorningTasks(morning)
      setEveningTasks(evening)

      // Calculate streaks (simplified - would need more complex logic in real app)
      setMorningStreak(morning.filter(t => t.completed).length)
      setEveningStreak(evening.filter(t => t.completed).length)
      
    } catch (error) {
      console.error('Error loading tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTodaysTasks = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      // Get templates
      const { data: templates } = await supabase
        .from('daily_nonnegotiables')
        .select('*')
        .order('time_of_day, order_index')

      if (!templates) return

      // Get user ID
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Create today's tasks
      const tasks = templates.map(template => ({
        user_id: user.id,
        date: today,
        time_of_day: template.time_of_day,
        item: template.item,
        completed: false
      }))

      const { error } = await supabase
        .from('daily_tasks')
        .upsert(tasks, { onConflict: 'user_id,date,time_of_day,item' })

      if (error) throw error

      // Reload tasks
      loadTodaysTasks()
    } catch (error) {
      console.error('Error creating tasks:', error)
    }
  }

  const toggleTask = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('daily_tasks')
        .update({ completed })
        .eq('id', taskId)

      if (error) throw error

      // Update local state
      setMorningTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, completed } : task
        )
      )
      setEveningTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, completed } : task
        )
      )
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="text-white/60">Loading daily tasks...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Daily Non-Negotiables (Today)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Morning Tasks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Morning</h3>
              <Badge variant="success">{morningStreak} day streak</Badge>
            </div>
            <div className="space-y-3">
              {morningTasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={(checked) => toggleTask(task.id, checked as boolean)}
                  />
                  <span className={`text-sm ${task.completed ? 'line-through text-white/50' : 'text-white'}`}>
                    {task.item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Evening Tasks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Evening</h3>
              <Badge variant="success">{eveningStreak} day streak</Badge>
            </div>
            <div className="space-y-3">
              {eveningTasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={(checked) => toggleTask(task.id, checked as boolean)}
                  />
                  <span className={`text-sm ${task.completed ? 'line-through text-white/50' : 'text-white'}`}>
                    {task.item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
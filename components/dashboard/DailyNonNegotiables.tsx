'use client'

import { useState, useEffect } from 'react'
import { Check, Clock, Flame } from 'lucide-react'
import { nonNegotiablesRepo, DailyNonNegotiables, NonNegotiableTask } from '@/src/data/nonnegotiables'
import { applyKpiDeltaForEvent } from '@/src/services/kpi-mapper'
import GlassCard from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

export default function DailyNonNegotiables() {
  const [data, setData] = useState<DailyNonNegotiables | null>(null)

  useEffect(() => {
    setData(nonNegotiablesRepo.getTodayData())
  }, [])

  const toggleTask = async (sessionId: string, taskId: string) => {
    if (!data) return
    
    const session = data[sessionId as keyof DailyNonNegotiables] as any
    const task = session.tasks.find((t: NonNegotiableTask) => t.id === taskId)
    
    if (task) {
      const newCompleted = !task.completed
      nonNegotiablesRepo.updateTaskCompletion(data.date, sessionId, taskId, newCompleted)
      
      // Apply KPI changes
      await applyKpiDeltaForEvent(task.text, newCompleted)
      
      // Update local state
      setData(prev => {
        if (!prev) return prev
        
        const updated = { ...prev }
        const updatedSession = { ...session }
        updatedSession.tasks = updatedSession.tasks.map((t: NonNegotiableTask) => 
          t.id === taskId ? { ...t, completed: newCompleted } : t
        )
        
        // Check if all tasks completed
        const allCompleted = updatedSession.tasks.every((t: NonNegotiableTask) => t.completed)
        updated[sessionId as keyof DailyNonNegotiables] = updatedSession
        updated[`${sessionId}Completed` as keyof DailyNonNegotiables] = allCompleted
        
        // Recalculate streak - simplified for now
        updated.streak = allCompleted ? (prev?.streak || 0) + 1 : (prev?.streak || 0)
        
        return updated
      })
    }
  }

  if (!data) return null

  const renderSession = (session: any, sessionId: string, color: string) => (
    <div key={sessionId} className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">{session.name}</h3>
        <div className="flex items-center space-x-2">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-sm text-gray-600">{data.streak} day streak</span>
        </div>
      </div>
      
      <div className={cn('p-4 rounded-lg', color)}>
        <div className="space-y-2">
          {session.tasks.map((task: NonNegotiableTask) => (
            <div
              key={task.id}
              className="flex items-center space-x-3 p-2 bg-white/50 rounded-lg hover:bg-white/70 transition-colors"
            >
              <button
                onClick={() => toggleTask(sessionId, task.id)}
                className={cn(
                  'flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                  task.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-300 hover:border-green-500'
                )}
              >
                {task.completed && <Check className="w-3 h-3" />}
              </button>
              
              <div className="flex-1">
                <span
                  className={cn(
                    'text-sm font-medium',
                    task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                  )}
                >
                  {task.text}
                </span>
              </div>
              
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{task.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🔵</span>
          <h2 className="text-xl font-bold text-gray-800">Daily Non-Negotiables</h2>
        </div>
        <span className="text-sm text-gray-500">2 Hours Total</span>
      </div>
      
      <div className="space-y-6">
        {renderSession(data.morning, 'morning', 'bg-orange-100')}
        {renderSession(data.evening, 'evening', 'bg-purple-100')}
      </div>
    </GlassCard>
  )
}
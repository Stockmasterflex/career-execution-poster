'use client'

import { useState, useEffect } from 'react'
import { Edit, Plus } from 'lucide-react'
import Header from '@/components/ui/Header'
import QuickNavigation from '@/components/ui/QuickNavigation'
import GlassCard from '@/components/ui/GlassCard'
import { scheduleRepo, ScheduleBlock } from '@/src/data/schedule'
import { cn } from '@/lib/utils'

export default function Calendar() {
  const [blocks, setBlocks] = useState<ScheduleBlock[]>([])
  const [editingBlock, setEditingBlock] = useState<ScheduleBlock | null>(null)

  useEffect(() => {
    setBlocks(scheduleRepo.getBlocks())
  }, [])

  const getBlocksByDay = (day: string) => {
    return blocks.filter(block => block.day === day)
  }

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      'time-gym': 'bg-blue-100 text-blue-800 border-blue-200',
      'time-study': 'bg-purple-100 text-purple-800 border-purple-200',
      'time-network': 'bg-pink-100 text-pink-800 border-pink-200',
      'time-content': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'time-meals': 'bg-red-100 text-red-800 border-red-200',
      'time-family': 'bg-green-100 text-green-800 border-green-200',
    }
    return colorMap[color] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return (
    <div className="app-bg min-h-screen">
      <Header title="Weekly Calendar" />
      
      <main className="max-w-7xl mx-auto px-6 py-8 pb-20">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Weekly Schedule</h1>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Add Block</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
            {days.map(day => {
              const dayBlocks = getBlocksByDay(day)
              return (
                <div key={day} className="space-y-3">
                  <h3 className="font-semibold text-gray-700 text-center py-2 bg-gray-50 rounded-lg">
                    {day}
                  </h3>
                  <div className="space-y-2 min-h-[200px]">
                    {dayBlocks.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-4">No blocks</p>
                    ) : (
                      dayBlocks.map(block => (
                        <div
                          key={block.id}
                          className={cn(
                            'p-3 rounded-lg border text-xs flex items-center justify-between',
                            getColorClass(block.color)
                          )}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{block.title}</div>
                            <div className="text-xs opacity-75 mt-1">
                              {block.startTime} - {block.endTime}
                      </div>
                            <div className="text-xs opacity-75 mt-1">
                              {block.tag}
                            </div>
                          </div>
                          <button
                            onClick={() => setEditingBlock(block)}
                            className="ml-2 text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                      </div>
                      ))
                    )}
                    </div>
                </div>
              )
            })}
              </div>
        </GlassCard>
      </main>
      
      <QuickNavigation />
    </div>
  )
}
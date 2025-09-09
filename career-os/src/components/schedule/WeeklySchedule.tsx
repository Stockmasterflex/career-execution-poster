'use client'

import { useState, useEffect } from 'react'
import { Plus, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfWeek, addDays, isToday } from 'date-fns'
import { createClient } from '@/lib/supabase-browser'
import type { Database } from '@/lib/database.types'
import ScheduleBlockModal from './ScheduleBlockModal'
import ScheduleBlock from './ScheduleBlock'

type ScheduleBlock = Database['public']['Tables']['schedule_blocks']['Row']

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']


interface WeeklyScheduleProps {
  userId: string
}

export default function WeeklySchedule({ userId }: WeeklyScheduleProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [blocks, setBlocks] = useState<ScheduleBlock[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBlock, setEditingBlock] = useState<ScheduleBlock | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }) // Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  useEffect(() => {
    loadScheduleBlocks()
  }, [currentWeek, userId])

  const loadScheduleBlocks = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('schedule_blocks')
        .select('*')
        .eq('user_id', userId)
        .order('start_time')

      if (error) throw error
      setBlocks(data || [])
    } catch (error) {
      console.error('Error loading schedule blocks:', error)
    } finally {
      setLoading(false)
    }
  }

  const getBlocksForDay = (dayIndex: number) => {
    return blocks
      .filter(block => block.day === dayIndex)
      .sort((a, b) => a.start_time.localeCompare(b.start_time))
  }

  const getNextAvailableTime = (dayIndex: number) => {
    const dayBlocks = getBlocksForDay(dayIndex)
    if (dayBlocks.length === 0) return '09:00'
    
    const lastBlock = dayBlocks[dayBlocks.length - 1]
    const [hours, minutes] = lastBlock.end_time.split(':').map(Number)
    const nextTime = new Date()
    nextTime.setHours(hours, minutes + 30, 0, 0)
    return nextTime.toTimeString().slice(0, 5)
  }

  const handleAddBlock = (dayIndex: number) => {
    const nextTime = getNextAvailableTime(dayIndex)
    setEditingBlock({
      id: '',
      user_id: userId,
      title: '',
      tag: 'study',
      day: dayIndex,
      start_time: nextTime,
      end_time: nextTime,
      details: null,
      created_at: '',
      updated_at: '',
    })
    setIsModalOpen(true)
  }

  const handleEditBlock = (block: ScheduleBlock) => {
    setEditingBlock(block)
    setIsModalOpen(true)
  }

  const handleSaveBlock = async (blockData: Omit<ScheduleBlock, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingBlock?.id) {
        // Update existing block
        const { error } = await supabase
          .from('schedule_blocks')
          .update(blockData)
          .eq('id', editingBlock.id)

        if (error) throw error
      } else {
        // Create new block
        const { error } = await supabase
          .from('schedule_blocks')
          .insert(blockData)

        if (error) throw error
      }

      await loadScheduleBlocks()
      setIsModalOpen(false)
      setEditingBlock(null)
    } catch (error) {
      console.error('Error saving schedule block:', error)
    }
  }

  const handleDeleteBlock = async (blockId: string) => {
    try {
      const { error } = await supabase
        .from('schedule_blocks')
        .delete()
        .eq('id', blockId)

      if (error) throw error
      await loadScheduleBlocks()
    } catch (error) {
      console.error('Error deleting schedule block:', error)
    }
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => {
      const newWeek = new Date(prev)
      newWeek.setDate(prev.getDate() + (direction === 'next' ? 7 : -7))
      return newWeek
    })
  }

  const goToToday = () => {
    setCurrentWeek(new Date())
  }

  if (loading) {
    return (
      <div className="bg-card-bg backdrop-blur-glass border border-border rounded-glass p-6 shadow-card">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4"></div>
          <div className="grid grid-cols-7 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-700 rounded"></div>
                <div className="h-20 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card-bg backdrop-blur-glass border border-border rounded-glass p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-section-title font-semibold text-white">Weekly Schedule</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-xs font-medium bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => navigateWeek('next')}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day, dayIndex) => {
          const dayBlocks = getBlocksForDay(dayIndex)
          const isCurrentDay = isToday(day)

          return (
            <div key={dayIndex} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className={`text-xs font-medium ${isCurrentDay ? 'text-purple-400' : 'text-gray-300'}`}>
                    {DAYS[dayIndex]}
                  </div>
                  <div className={`text-sm font-semibold ${isCurrentDay ? 'text-white' : 'text-gray-400'}`}>
                    {format(day, 'd')}
                  </div>
                </div>
                {isCurrentDay && (
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                )}
              </div>

              <div className="space-y-1 min-h-[200px]">
                {dayBlocks.map((block) => (
                  <ScheduleBlock
                    key={block.id}
                    block={block}
                    onEdit={() => handleEditBlock(block)}
                    onDelete={() => handleDeleteBlock(block.id)}
                  />
                ))}
                <button
                  onClick={() => handleAddBlock(dayIndex)}
                  className="w-full p-2 text-xs text-gray-400 hover:text-white hover:bg-gray-800 rounded border-2 border-dashed border-gray-600 hover:border-gray-500 transition-colors"
                >
                  <Plus className="h-3 w-3 mx-auto mb-1" />
                  New block
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {blocks.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No schedule blocks yet</h3>
          <p className="text-gray-400 mb-4">Start building your weekly routine</p>
          <button
            onClick={() => handleAddBlock(0)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Add your first block
          </button>
        </div>
      )}

      <ScheduleBlockModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingBlock(null)
        }}
        onSave={handleSaveBlock}
        block={editingBlock}
      />
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface ScheduleBlock {
  id: string
  day: number
  start: string
  end: string
  tag: 'gym' | 'market' | 'study' | 'network' | 'content' | 'meal' | 'family'
  title: string
  details?: string
}

interface WeeklyScheduleProps {
  userId: string
}

const DAYS = [
  { id: 1, name: 'Monday', short: 'Mon' },
  { id: 2, name: 'Tuesday', short: 'Tue' },
  { id: 3, name: 'Wednesday', short: 'Wed' },
  { id: 4, name: 'Thursday', short: 'Thu' },
  { id: 5, name: 'Friday', short: 'Fri' },
  { id: 6, name: 'Saturday', short: 'Sat' },
  { id: 7, name: 'Sunday', short: 'Sun' }
]

const TAG_COLORS = {
  gym: 'bg-red-100 text-red-800 border-red-200',
  market: 'bg-blue-100 text-blue-800 border-blue-200',
  study: 'bg-green-100 text-green-800 border-green-200',
  network: 'bg-purple-100 text-purple-800 border-purple-200',
  content: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  meal: 'bg-orange-100 text-orange-800 border-orange-200',
  family: 'bg-pink-100 text-pink-800 border-pink-200'
}

export default function WeeklySchedule({ userId }: WeeklyScheduleProps) {
  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [editingBlock, setEditingBlock] = useState<ScheduleBlock | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)

  const loadSchedule = async () => {
    try {
      console.log('[SCHEDULE] Loading schedule for user:', userId)
      
      const { data, error } = await supabase
        .from('schedule_blocks')
        .select('*')
        .eq('user_id', userId)
        .order('day', { ascending: true })
        .order('start', { ascending: true })

      if (error) {
        console.error('[SCHEDULE] Error loading schedule:', error)
        return
      }

      setScheduleBlocks(data || [])
    } catch (error) {
      console.error('[SCHEDULE] Error in loadSchedule:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveBlock = async (block: Omit<ScheduleBlock, 'id'> & { id?: string }) => {
    try {
      if (block.id) {
        // Update existing block
        const { error } = await supabase
          .from('schedule_blocks')
          .update({
            day: block.day,
            start: block.start,
            end: block.end,
            tag: block.tag,
            title: block.title,
            details: block.details
          })
          .eq('id', block.id)
          .eq('user_id', userId)

        if (error) {
          console.error('[SCHEDULE] Error updating block:', error)
          return
        }
      } else {
        // Create new block
        const { error } = await supabase
          .from('schedule_blocks')
          .insert({
            user_id: userId,
            day: block.day,
            start: block.start,
            end: block.end,
            tag: block.tag,
            title: block.title,
            details: block.details
          })

        if (error) {
          console.error('[SCHEDULE] Error creating block:', error)
          return
        }
      }

      await loadSchedule()
      setEditingBlock(null)
      setIsAddingNew(false)
    } catch (error) {
      console.error('[SCHEDULE] Error saving block:', error)
    }
  }

  const deleteBlock = async (blockId: string) => {
    try {
      const { error } = await supabase
        .from('schedule_blocks')
        .delete()
        .eq('id', blockId)
        .eq('user_id', userId)

      if (error) {
        console.error('[SCHEDULE] Error deleting block:', error)
        return
      }

      await loadSchedule()
    } catch (error) {
      console.error('[SCHEDULE] Error deleting block:', error)
    }
  }

  const getBlocksForDay = (day: number) => {
    return scheduleBlocks.filter(block => block.day === day)
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  useEffect(() => {
    if (userId) {
      loadSchedule()
    }
  }, [userId])

  if (loading) {
    return <div className="p-4">Loading weekly schedule...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Weekly Schedule</h2>
        <button
          onClick={() => setIsAddingNew(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Block
        </button>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {DAYS.map((day) => (
          <div key={day.id} className="bg-white rounded-lg shadow p-3">
            <h3 className="font-semibold text-gray-800 mb-3 text-center">
              {day.short}
            </h3>
            <div className="space-y-2">
              {getBlocksForDay(day.id).map((block) => (
                <div
                  key={block.id}
                  className={`p-2 rounded border text-xs ${TAG_COLORS[block.tag]}`}
                >
                  <div className="font-medium">{block.title}</div>
                  <div className="text-xs opacity-75">
                    {formatTime(block.start)} - {formatTime(block.end)}
                  </div>
                  {block.details && (
                    <div className="text-xs opacity-60 mt-1">{block.details}</div>
                  )}
                  <div className="flex space-x-1 mt-2">
                    <button
                      onClick={() => setEditingBlock(block)}
                      className="text-xs px-2 py-1 bg-white bg-opacity-50 rounded hover:bg-opacity-75"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteBlock(block.id)}
                      className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      {(editingBlock || isAddingNew) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {isAddingNew ? 'Add Schedule Block' : 'Edit Schedule Block'}
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const block = {
                id: editingBlock?.id,
                day: parseInt(formData.get('day') as string),
                start: formData.get('start') as string,
                end: formData.get('end') as string,
                tag: formData.get('tag') as ScheduleBlock['tag'],
                title: formData.get('title') as string,
                details: formData.get('details') as string
              }
              saveBlock(block)
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Day
                  </label>
                  <select
                    name="day"
                    defaultValue={editingBlock?.day || 1}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {DAYS.map((day) => (
                      <option key={day.id} value={day.id}>
                        {day.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      name="start"
                      defaultValue={editingBlock?.start || '09:00'}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      name="end"
                      defaultValue={editingBlock?.end || '10:00'}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="tag"
                    defaultValue={editingBlock?.tag || 'study'}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="gym">Gym</option>
                    <option value="market">Market</option>
                    <option value="study">Study</option>
                    <option value="network">Network</option>
                    <option value="content">Content</option>
                    <option value="meal">Meal</option>
                    <option value="family">Family</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingBlock?.title || ''}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Details (optional)
                  </label>
                  <textarea
                    name="details"
                    defaultValue={editingBlock?.details || ''}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {isAddingNew ? 'Add Block' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingBlock(null)
                    setIsAddingNew(false)
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
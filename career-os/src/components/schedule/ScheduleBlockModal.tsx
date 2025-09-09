'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { scheduleBlockSchema } from '@/lib/schemas'
import type { Database } from '@/lib/database.types'

type ScheduleBlock = Database['public']['Tables']['schedule_blocks']['Row']

const TAG_OPTIONS = [
  { value: 'gym', label: 'Gym', color: 'bg-tag-gym' },
  { value: 'market', label: 'Market', color: 'bg-tag-market' },
  { value: 'study', label: 'Study', color: 'bg-tag-study' },
  { value: 'network', label: 'Network', color: 'bg-tag-network' },
  { value: 'content', label: 'Content', color: 'bg-tag-content' },
  { value: 'meal', label: 'Meal', color: 'bg-tag-meal' },
  { value: 'family', label: 'Family', color: 'bg-tag-family' },
]

const DAY_OPTIONS = [
  { value: 0, label: 'Monday' },
  { value: 1, label: 'Tuesday' },
  { value: 2, label: 'Wednesday' },
  { value: 3, label: 'Thursday' },
  { value: 4, label: 'Friday' },
  { value: 5, label: 'Saturday' },
  { value: 6, label: 'Sunday' },
]

interface ScheduleBlockModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<ScheduleBlock, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  block: ScheduleBlock | null
}

export default function ScheduleBlockModal({ isOpen, onClose, onSave, block }: ScheduleBlockModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    tag: 'study' as 'gym' | 'market' | 'study' | 'network' | 'content' | 'meal' | 'family',
    day: 0,
    start_time: '09:00',
    end_time: '10:00',
    details: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (block) {
      setFormData({
        title: block.title,
        tag: block.tag,
        day: block.day,
        start_time: block.start_time,
        end_time: block.end_time,
        details: block.details || '',
      })
    } else {
      setFormData({
        title: '',
        tag: 'study',
        day: 0,
        start_time: '09:00',
        end_time: '10:00',
        details: '',
      })
    }
    setErrors({})
  }, [block, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const validatedData = scheduleBlockSchema.parse(formData)
      
      // Validate time overlap
      if (formData.start_time >= formData.end_time) {
        setErrors({ end_time: 'End time must be after start time' })
        setLoading(false)
        return
      }

      await onSave({
        user_id: block?.user_id || '',
        ...validatedData,
        details: validatedData.details || null,
      })
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ general: error.message })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">
            {block ? 'Edit Block' : 'Add Block'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {errors.general && (
            <div className="text-red-400 text-sm">{errors.general}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="Enter block title"
            />
            {errors.title && <div className="text-red-400 text-xs mt-1">{errors.title}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TAG_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleChange('tag', option.value)}
                  className={`p-2 text-xs font-medium rounded border transition-colors ${
                    formData.tag === option.value
                      ? `${option.color} text-white border-transparent`
                      : 'bg-gray-800 text-gray-300 border-gray-600 hover:border-gray-500'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Day
            </label>
            <select
              value={formData.day}
              onChange={(e) => handleChange('day', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              {DAY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={formData.start_time}
                onChange={(e) => handleChange('start_time', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              {errors.start_time && <div className="text-red-400 text-xs mt-1">{errors.start_time}</div>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={formData.end_time}
                onChange={(e) => handleChange('end_time', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              {errors.end_time && <div className="text-red-400 text-xs mt-1">{errors.end_time}</div>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Details (Optional)
            </label>
            <textarea
              value={formData.details}
              onChange={(e) => handleChange('details', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="Add any additional details..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (block ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
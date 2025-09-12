'use client'

import { useState } from 'react'
import { Edit2, Trash2, Clock } from 'lucide-react'
import type { Database } from '@/lib/database.types'

type ScheduleBlock = Database['public']['Tables']['schedule_blocks']['Row']

const TAG_COLORS = {
  gym: 'bg-tag-gym',
  market: 'bg-tag-market',
  study: 'bg-tag-study',
  network: 'bg-tag-network',
  content: 'bg-tag-content',
  meal: 'bg-tag-meal',
  family: 'bg-tag-family',
}

const TAG_LABELS = {
  gym: 'Gym',
  market: 'Market',
  study: 'Study',
  network: 'Network',
  content: 'Content',
  meal: 'Meal',
  family: 'Family',
}

interface ScheduleBlockProps {
  block: ScheduleBlock
  onEdit: () => void
  onDelete: () => void
}

export default function ScheduleBlock({ block, onEdit, onDelete }: ScheduleBlockProps) {
  const [showActions, setShowActions] = useState(false)

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div
      className={`relative p-2 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors cursor-pointer group ${TAG_COLORS[block.tag]} bg-opacity-20`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${TAG_COLORS[block.tag]} text-white`}>
              {TAG_LABELS[block.tag]}
            </span>
            <div className="flex items-center text-xs text-gray-300">
              <Clock className="h-3 w-3 mr-1" />
              {formatTime(block.start_time)} - {formatTime(block.end_time)}
            </div>
          </div>
          <h4 className="text-sm font-medium text-white truncate">{block.title}</h4>
          {block.details && (
            <p className="text-xs text-gray-300 mt-1 line-clamp-2">{block.details}</p>
          )}
        </div>

        {showActions && (
          <div className="flex items-center space-x-1 ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <Edit2 className="h-3 w-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="p-1 text-gray-400 hover:text-red-400 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
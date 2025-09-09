'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react'
import { applyKpiDeltaForEvent } from '@/src/services/kpi-mapper'
import GlassCard from '@/components/ui/GlassCard'

type DayKey = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN'
type TimeKey = '6:00 AM' | '7:00 AM' | '8:00 AM' | '9:00 AM' | '1:00 PM' | '2:00 PM' | '6:00 PM' | '10:00 PM'

interface CalendarCell {
  id: string
  title: string
  color: string
  kpiTags?: string[]
  done?: boolean
}

type WeekSchedule = Record<DayKey, Record<TimeKey, CalendarCell | null>>

export default function WeeklySchedule() {
  const [schedule, setSchedule] = useState<WeekSchedule>({})
  const [editingCell, setEditingCell] = useState<{ day: DayKey; time: TimeKey } | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  const timeSlots: TimeKey[] = ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '1:00 PM', '2:00 PM', '6:00 PM', '10:00 PM']
  const days: DayKey[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

  useEffect(() => {
    loadSchedule()
  }, [])

  const loadSchedule = () => {
    const stored = localStorage.getItem('career_os_schedule')
    if (stored) {
      setSchedule(JSON.parse(stored))
    } else {
      // Initialize empty schedule
      const emptySchedule: WeekSchedule = {} as WeekSchedule
      days.forEach(day => {
        emptySchedule[day] = {} as Record<TimeKey, CalendarCell | null>
        timeSlots.forEach(time => {
          emptySchedule[day][time] = null
        })
      })
      setSchedule(emptySchedule)
    }
  }


  const toggleCell = async (day: DayKey, time: TimeKey) => {
    const cell = schedule[day]?.[time]
    if (!cell) return

    const newDone = !cell.done
    const updatedCell = { ...cell, done: newDone }
    
    const newSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        [time]: updatedCell
      }
    }
    
    setSchedule(newSchedule)
    localStorage.setItem('career_os_schedule', JSON.stringify(newSchedule))
    
    // Apply KPI changes
    await applyKpiDeltaForEvent(cell.title, newDone)
  }

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      'time-gym': 'bg-blue-100 text-blue-800 border-blue-200',
      'time-study': 'bg-purple-100 text-purple-800 border-purple-200',
      'time-network': 'bg-pink-100 text-pink-800 border-pink-200',
      'time-content': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'time-meals': 'bg-red-100 text-red-800 border-red-200',
      'time-family': 'bg-green-100 text-green-800 border-green-200',
      'time-market': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'time-planning': 'bg-violet-100 text-violet-800 border-violet-200',
    }
    return colorMap[color] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Weekly Execution Schedule</h2>
          <p className="text-sm text-gray-600">Phase 1 • Week — Sept-Dec 2025 • Days left: —</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Color-Coded Time Blocks</span>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Block</span>
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {['LEADS', 'APPS (WK)', 'INTERVIEWS', 'OFFERS'].map((label) => (
          <div key={label} className="bg-gray-100 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-gray-800">—</div>
            <div className="text-sm text-gray-600">{label}</div>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-24 p-2 text-left text-sm font-medium text-gray-700">TIME</th>
              {days.map(day => (
                <th key={day} className="w-32 p-2 text-center text-sm font-medium text-gray-700">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(time => (
              <tr key={time} className="border-b border-gray-200">
                <td className="p-2 text-sm font-medium text-gray-700">{time}</td>
                {days.map(day => {
                  const cell = schedule[day]?.[time]
                  return (
                    <td key={`${day}-${time}`} className="p-1">
                      {cell ? (
                        <div
                          className={`p-2 rounded-lg border text-xs cursor-pointer hover:opacity-80 transition-opacity ${getColorClass(cell.color)}`}
                          onClick={() => toggleCell(day, time)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium truncate">{cell.title}</span>
                            <input
                              type="checkbox"
                              checked={cell.done || false}
                              onChange={() => toggleCell(day, time)}
                              className="ml-2"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="h-12 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
                          <button
                            onClick={() => setEditingCell({ day, time })}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  )
}
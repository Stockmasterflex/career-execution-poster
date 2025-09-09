'use client'

import { useState } from 'react'
import { Check, Edit2, X } from 'lucide-react'

interface KPICardProps {
  id: string
  name: string
  currentValue: number
  targetValue: number
  phase: number
  onUpdate: (id: string, currentValue: number, targetValue: number) => Promise<void>
}

export default function KPICard({ id, name, currentValue, targetValue, phase, onUpdate }: KPICardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [current, setCurrent] = useState(currentValue.toString())
  const [target, setTarget] = useState(targetValue.toString())
  const [loading, setLoading] = useState(false)

  const progress = targetValue > 0 ? (currentValue / targetValue) * 100 : 0

  const handleSave = async () => {
    const newCurrent = parseFloat(current)
    const newTarget = parseFloat(target)
    
    if (isNaN(newCurrent) || isNaN(newTarget) || newCurrent < 0 || newTarget < 0) {
      return
    }

    setLoading(true)
    try {
      await onUpdate(id, newCurrent, newTarget)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update KPI:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setCurrent(currentValue.toString())
    setTarget(targetValue.toString())
    setIsEditing(false)
  }

  return (
    <div className="bg-card-bg backdrop-blur-glass border border-border rounded-glass p-4 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-card-title font-medium text-white">{name}</h3>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 text-xs font-medium bg-purple-600 text-white rounded-full">
            Phase {phase}
          </span>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex items-center space-x-1">
              <button
                onClick={handleSave}
                disabled={loading}
                className="p-1 text-green-400 hover:text-green-300 transition-colors disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 text-red-400 hover:text-red-300 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-300 mb-1">Current</label>
            <input
              type="number"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="w-full px-2 py-1 text-sm bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-300 mb-1">Target</label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full px-2 py-1 text-sm bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Progress</span>
            <span className="text-white font-medium">
              {currentValue} / {targetValue}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-400 text-right">
            {progress.toFixed(1)}%
          </div>
        </div>
      )}
    </div>
  )
}
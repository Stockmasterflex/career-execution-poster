'use client'

import { useState, useCallback } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Edit2, Check, X } from 'lucide-react'

interface KPICardProps {
  id: string
  userId: string
  phase: number
  key: string
  label: string
  current: number
  target: number
  onUpdate?: (id: string, updates: { current: number; target: number }) => void
}

export default function KPICard({ 
  id, 
  userId, 
  phase, 
  key, 
  label, 
  current, 
  target, 
  onUpdate 
}: KPICardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editCurrent, setEditCurrent] = useState(current.toString())
  const [editTarget, setEditTarget] = useState(target.toString())
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = getSupabaseBrowser()

  const percentage = Math.min((current / target) * 100, 100)

  const phaseColors = {
    1: 'bg-phase-1',
    2: 'bg-phase-2',
    3: 'bg-phase-3',
    4: 'bg-phase-4',
  } as const

  const progressColors = {
    1: 'bg-purple-500',
    2: 'bg-blue-500',
    3: 'bg-green-500',
    4: 'bg-purple-500',
  } as const

  const handleEdit = () => {
    setIsEditing(true)
    setEditCurrent(current.toString())
    setEditTarget(target.toString())
    setError(null)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditCurrent(current.toString())
    setEditTarget(target.toString())
    setError(null)
  }

  const handleSave = async () => {
    const newCurrent = parseFloat(editCurrent)
    const newTarget = parseFloat(editTarget)

    if (isNaN(newCurrent) || isNaN(newTarget) || newTarget <= 0) {
      setError('Please enter valid numbers')
      return
    }

    try {
      setIsSaving(true)
      setError(null)

      const { error } = await supabase
        .from('kpis')
        .update({ 
          current: newCurrent, 
          target: newTarget 
        })
        .eq('id', id)
        .eq('user_id', userId)

      if (error) throw error

      // Update parent component
      if (onUpdate) {
        onUpdate(id, { current: newCurrent, target: newTarget })
      }

      setIsEditing(false)
    } catch (err) {
      console.error('Error updating KPI:', err)
      setError('Failed to update KPI')
    } finally {
      setIsSaving(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <div className="kpi-card group relative">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-8 h-8 ${phaseColors[phase as keyof typeof phaseColors] || 'bg-gray-500'} rounded-lg flex items-center justify-center text-white`}>
          <span className="text-xs font-bold">{phase}</span>
        </div>
        <div className="text-right flex-1 ml-3">
          <p className="text-sm font-medium text-text-primary">{label}</p>
          {isEditing ? (
            <div className="flex gap-1 mt-1">
              <Input
                value={editCurrent}
                onChange={(e) => setEditCurrent(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-12 h-6 text-xs"
                placeholder="0"
              />
              <span className="text-xs text-text-muted self-center">/</span>
              <Input
                value={editTarget}
                onChange={(e) => setEditTarget(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-12 h-6 text-xs"
                placeholder="100"
              />
            </div>
          ) : (
            <p className="text-xs text-text-secondary">{current}/{target}</p>
          )}
        </div>
        {!isEditing && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleEdit}
            className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
          >
            <Edit2 className="w-3 h-3" />
          </Button>
        )}
      </div>

      <div className="progress-bar">
        <div
          className={`progress-fill ${progressColors[phase as keyof typeof progressColors] || 'bg-gray-500'}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {isEditing && (
        <div className="flex gap-1 mt-2">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="h-6 px-2 text-xs"
          >
            <Check className="w-3 h-3 mr-1" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
            className="h-6 px-2 text-xs"
          >
            <X className="w-3 h-3 mr-1" />
            Cancel
          </Button>
        </div>
      )}

      {error && (
        <p className="text-xs text-error mt-1">{error}</p>
      )}
    </div>
  )
}

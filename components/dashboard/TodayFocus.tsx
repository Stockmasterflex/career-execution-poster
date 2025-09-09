'use client'

import { useState, useEffect } from 'react'
import { Plus, Check, Trash2, GripVertical } from 'lucide-react'
import { focusRepo, FocusItem } from '@/src/data/focus'
import { applyKpiDeltaForEvent } from '@/src/services/kpi-mapper'
import GlassCard from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

export default function TodayFocus() {
  const [items, setItems] = useState<FocusItem[]>([])
  const [newItem, setNewItem] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    setItems(focusRepo.getItems())
  }, [])

  const addItem = async () => {
    if (newItem.trim()) {
      const item = focusRepo.addItem(newItem.trim())
      setItems(prev => [...prev, item])
      setNewItem('')
      setIsAdding(false)
    }
  }

  const toggleComplete = async (id: string) => {
    const item = items.find(i => i.id === id)
    if (item) {
      const newCompleted = !item.completed
      focusRepo.updateItem(id, { completed: newCompleted })
      setItems(prev => prev.map(i => i.id === id ? { ...i, completed: newCompleted } : i))
      
      // Apply KPI changes if the item title matches a known event
      await applyKpiDeltaForEvent(item.text, newCompleted)
    }
  }

  const deleteItem = (id: string) => {
    focusRepo.deleteItem(id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const moveItem = (fromIndex: number, toIndex: number) => {
    focusRepo.reorderItems(fromIndex, toIndex)
    const newItems = [...items]
    const [removed] = newItems.splice(fromIndex, 1)
    newItems.splice(toIndex, 0, removed)
    setItems(newItems)
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">☀️</span>
          <h2 className="text-xl font-bold text-gray-800">Today's Focus</h2>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {isAdding && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="What do you want to focus on today?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
            autoFocus
          />
          <div className="flex space-x-2 mt-2">
            <button
              onClick={addItem}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => {
                setIsAdding(false)
                setNewItem('')
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No focus items yet. Add one above!</p>
        ) : (
          items.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <button
                onClick={() => moveItem(index, Math.max(0, index - 1))}
                className="text-gray-400 hover:text-gray-600"
              >
                <GripVertical className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => toggleComplete(item.id)}
                className={cn(
                  'flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                  item.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-300 hover:border-green-500'
                )}
              >
                {item.completed && <Check className="w-3 h-3" />}
              </button>
              
              <span
                className={cn(
                  'flex-1 text-sm',
                  item.completed ? 'line-through text-gray-500' : 'text-gray-800'
                )}
              >
                {item.text}
              </span>
              
              <button
                onClick={() => deleteItem(item.id)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </GlassCard>
  )
}
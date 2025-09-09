'use client'

import { useState, useEffect } from 'react'
import { Edit2 } from 'lucide-react'
import { kpiRepo, KPI } from '@/src/data/kpis'
import GlassCard from '@/components/ui/GlassCard'
import ProgressBar from '@/components/ui/ProgressBar'

export default function KpiStrip() {
  const [kpis, setKpis] = useState<KPI[]>([])
  const [editingKpi, setEditingKpi] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    // Import and use the repo
    const { kpiRepo } = require('@/src/data/kpis')
    setKpis(kpiRepo.getKPIsByPhase(1)) // Phase 1 KPIs for dashboard
  }, [])

  const startEdit = (kpi: KPI) => {
    setEditingKpi(kpi.id)
    setEditValue(kpi.current.toString())
  }

  const saveEdit = (kpiId: string) => {
    const newValue = parseInt(editValue)
    if (!isNaN(newValue) && newValue >= 0) {
      const { kpiRepo } = require('@/src/data/kpis')
      kpiRepo.updateKPI(kpiId, newValue)
      setKpis(prev => prev.map(kpi => 
        kpi.id === kpiId ? { ...kpi, current: newValue } : kpi
      ))
    }
    setEditingKpi(null)
    setEditValue('')
  }

  const cancelEdit = () => {
    setEditingKpi(null)
    setEditValue('')
  }

  return (
    <GlassCard className="p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Phase 1 KPI Progress</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map(kpi => (
          <div key={kpi.id} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-800 text-sm">{kpi.name}</h3>
              <button
                onClick={() => startEdit(kpi)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            
            {editingKpi === kpi.id ? (
              <div className="space-y-2">
                <input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => saveEdit(kpi.id)}
                    className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-800">
                    {kpi.current}/{kpi.target} {kpi.unit}
                  </span>
                </div>
                <ProgressBar
                  current={kpi.current}
                  target={kpi.target}
                  label=""
                  showValues={false}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
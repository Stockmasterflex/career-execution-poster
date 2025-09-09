'use client'

import { useState, useEffect } from 'react'
import { Edit2 } from 'lucide-react'
import { kpiRepo, KPI } from '@/src/data/kpis'
import GlassCard from '@/components/ui/GlassCard'
import ProgressBar from '@/components/ui/ProgressBar'

export default function KpiTracker() {
  const [kpis, setKpis] = useState<KPI[]>([])
  const [editingKpi, setEditingKpi] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    loadKpis()
    const handleKpiChange = () => loadKpis()
    window.addEventListener('kpi:changed', handleKpiChange)
    return () => window.removeEventListener('kpi:changed', handleKpiChange)
  }, [])

  const loadKpis = () => {
    setKpis(kpiRepo.getKPIsByPhase(1))
  }

  const startEdit = (kpi: KPI) => {
    setEditingKpi(kpi.id)
    setEditValue(kpi.current.toString())
  }

  const saveEdit = (kpiId: string) => {
    const newValue = parseInt(editValue)
    if (!isNaN(newValue) && newValue >= 0) {
      kpiRepo.updateKPI(kpiId, newValue)
      loadKpis()
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Phase 1 KPI Progress</h2>
        <span className="text-sm text-gray-500">Quick Glance - Sept-Dec 2025</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map(kpi => (
          <div key={kpi.id} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
                {kpi.name.replace(' ', ' ')}
              </h3>
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
                  <span className="font-bold text-gray-800">
                    {kpi.current}/{kpi.target}
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

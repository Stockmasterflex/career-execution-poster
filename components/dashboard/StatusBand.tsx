'use client'

import GlassCard from '@/components/ui/GlassCard'

export default function StatusBand() {
  return (
    <GlassCard className="p-4">
      <div className="text-center">
        <div className="text-lg font-bold text-gray-800 mb-1">
          Phase 1 • Week — Sept–Dec 2025 • Days left: —
        </div>
        <div className="text-sm text-gray-600">
          Foundation & Market Entry
        </div>
      </div>
    </GlassCard>
  )
}

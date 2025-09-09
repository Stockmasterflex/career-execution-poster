'use client'

import GlassCard from '@/components/ui/GlassCard'

export default function CurrentStatus() {
  return (
    <GlassCard className="p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Current Status</h2>
      <div className="prose prose-sm max-w-none">
        <p className="text-gray-700 leading-relaxed">
          Currently in Phase 1 of career transition, focusing on building technical skills 
          in financial markets and quantitative analysis. Actively studying for CMT certification 
          while expanding professional network through strategic outreach and content creation. 
          Making steady progress on application pipeline with 15 target companies identified 
          across different tiers. Website development is 25% complete with core functionality 
          implemented. Next milestone is completing CMT study hours and securing first coffee chat.
        </p>
      </div>
    </GlassCard>
  )
}

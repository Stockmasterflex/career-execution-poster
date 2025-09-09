'use client'

import Header from '@/components/ui/Header'
import QuickNavigation from '@/components/ui/QuickNavigation'
import GlassCard from '@/components/ui/GlassCard'
import Pill from '@/components/ui/Pill'

export default function Phase3() {
  return (
    <div className="app-bg min-h-screen">
      <Header title="Phase 3: Apply" phase={3} />
      
      <main className="max-w-7xl mx-auto px-6 py-8 pb-20">
        <div className="space-y-8">
          <GlassCard className="p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Phase 3: Application Phase
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Execute your application strategy and secure interviews
            </p>
            <div className="flex justify-center space-x-4">
              <Pill variant="phase3" size="lg">Jul 2024 - Sep 2024</Pill>
              <Pill variant="default" size="lg">Upcoming</Pill>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Key Objectives</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700">Applications</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Submit 50+ applications</li>
                  <li>• Customize resumes & cover letters</li>
                  <li>• Track application status</li>
                  <li>• Follow up strategically</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700">Interview Prep</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Practice technical interviews</li>
                  <li>• Prepare behavioral stories</li>
                  <li>• Research target companies</li>
                  <li>• Mock interview sessions</li>
                </ul>
              </div>
            </div>
          </GlassCard>
        </div>
      </main>
      
      <QuickNavigation />
    </div>
  )
}
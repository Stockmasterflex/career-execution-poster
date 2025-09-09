'use client'

import Header from '@/components/ui/Header'
import QuickNavigation from '@/components/ui/QuickNavigation'
import GlassCard from '@/components/ui/GlassCard'
import Pill from '@/components/ui/Pill'

export default function Phase2() {
  return (
    <div className="app-bg min-h-screen">
      <Header title="Phase 2: Network" phase={2} />
      
      <main className="max-w-7xl mx-auto px-6 py-8 pb-20">
        <div className="space-y-8">
          <GlassCard className="p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Phase 2: Network Expansion
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Build meaningful professional relationships and expand your network
            </p>
            <div className="flex justify-center space-x-4">
              <Pill variant="phase2" size="lg">Apr 2024 - Jun 2024</Pill>
              <Pill variant="default" size="lg">Upcoming</Pill>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Key Objectives</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700">Networking</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Attend industry events</li>
                  <li>• Join professional groups</li>
                  <li>• Schedule coffee chats</li>
                  <li>• Build referral network</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700">Content & Brand</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Publish thought leadership</li>
                  <li>• Engage on social media</li>
                  <li>• Speak at events</li>
                  <li>• Build online presence</li>
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
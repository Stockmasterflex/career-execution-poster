'use client'

import Header from '@/components/ui/Header'
import QuickNavigation from '@/components/ui/QuickNavigation'
import GlassCard from '@/components/ui/GlassCard'
import Pill from '@/components/ui/Pill'

export default function Phase4() {
  return (
    <div className="app-bg min-h-screen">
      <Header title="Phase 4: Land" phase={4} />
      
      <main className="max-w-7xl mx-auto px-6 py-8 pb-20">
        <div className="space-y-8">
          <GlassCard className="p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Phase 4: Landing Offers
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Close the deal and secure your dream role
            </p>
            <div className="flex justify-center space-x-4">
              <Pill variant="phase4" size="lg">Oct 2024 - Dec 2024</Pill>
              <Pill variant="default" size="lg">Upcoming</Pill>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Key Objectives</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700">Negotiation</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Evaluate offers strategically</li>
                  <li>• Negotiate compensation</li>
                  <li>• Understand benefits packages</li>
                  <li>• Make informed decisions</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700">Transition</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Give proper notice</li>
                  <li>• Plan onboarding</li>
                  <li>• Set up new workspace</li>
                  <li>• Celebrate success!</li>
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
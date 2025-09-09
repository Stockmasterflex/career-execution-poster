'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/ui/Header'
import QuickNavigation from '@/components/ui/QuickNavigation'
import GlassCard from '@/components/ui/GlassCard'
import KpiStrip from '@/components/dashboard/KpiStrip'
import Pill from '@/components/ui/Pill'

export default function Phase1() {
  const [kpis, setKpis] = useState([])

  useEffect(() => {
    // Load Phase 1 KPIs
    const { kpiRepo } = require('@/src/data/kpis')
    setKpis(kpiRepo.getKPIsByPhase(1))
  }, [])

  return (
    <div className="app-bg min-h-screen">
      <Header title="Phase 1: Foundation" phase={1} />
      
      <main className="max-w-7xl mx-auto px-6 py-8 pb-20">
        <div className="space-y-8">
          {/* Hero Section */}
          <GlassCard className="p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Phase 1: Foundation Building
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Build your technical foundation and establish credibility in financial markets
            </p>
            <div className="flex justify-center space-x-4">
              <Pill variant="phase1" size="lg">Jan 2024 - Mar 2024</Pill>
              <Pill variant="success" size="lg">Current Phase</Pill>
            </div>
          </GlassCard>

          {/* Key Objectives */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Key Objectives</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700">Technical Skills</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Complete CMT certification study</li>
                  <li>• Build quantitative analysis skills</li>
                  <li>• Master financial modeling</li>
                  <li>• Learn Python for finance</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700">Professional Development</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Create professional website</li>
                  <li>• Build LinkedIn presence</li>
                  <li>• Develop personal brand</li>
                  <li>• Start networking outreach</li>
                </ul>
              </div>
            </div>
          </GlassCard>

          {/* KPI Progress */}
          <KpiStrip />

          {/* Success Metrics */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Success Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-2">100</div>
                <div className="text-sm text-gray-600">CMT Study Hours</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-2">40</div>
                <div className="text-sm text-gray-600">LinkedIn Posts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-2">8</div>
                <div className="text-sm text-gray-600">Coffee Chats</div>
              </div>
            </div>
          </GlassCard>
        </div>
      </main>
      
      <QuickNavigation />
    </div>
  )
}
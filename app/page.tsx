'use client'

import Link from 'next/link'
import { Target, Calendar, BarChart3, Users, BookOpen, Zap } from 'lucide-react'
import Header from '@/components/ui/Header'
import QuickNavigation from '@/components/ui/QuickNavigation'
import GlassCard from '@/components/ui/GlassCard'

export default function Home() {
  const navigationTiles = [
    {
      title: 'Dashboard',
      description: 'Daily focus and progress tracking',
      href: '/dashboard',
      icon: BarChart3,
      gradient: 'bg-gradient-dashboard'
    },
    {
      title: 'Phase 1',
      description: 'Foundation building',
      href: '/phase-1',
      icon: Target,
      gradient: 'bg-gradient-phase-1'
    },
    {
      title: 'Phase 2',
      description: 'Network expansion',
      href: '/phase-2',
      icon: Users,
      gradient: 'bg-gradient-phase-2'
    },
    {
      title: 'Phase 3',
      description: 'Application phase',
      href: '/phase-3',
      icon: BookOpen,
      gradient: 'bg-gradient-phase-3'
    },
    {
      title: 'Phase 4',
      description: 'Landing offers',
      href: '/phase-4',
      icon: Zap,
      gradient: 'bg-gradient-phase-4'
    },
    {
      title: 'Calendar',
      description: 'Weekly schedule view',
      href: '/calendar',
      icon: Calendar,
      gradient: 'bg-gradient-to-r from-purple-500 to-pink-500'
    }
  ]

  return (
    <div className="app-bg min-h-screen">
      <Header title="Career OS" />
      
      <main className="max-w-7xl mx-auto px-6 py-12 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to Career OS
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Your comprehensive career transition management system. Track progress, 
            manage phases, and execute your path to success.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationTiles.map((tile) => {
            const Icon = tile.icon
            return (
              <Link key={tile.href} href={tile.href}>
                <GlassCard className="p-6 hover:scale-105 transition-transform duration-200">
                  <div className={`${tile.gradient} text-white p-4 rounded-lg mb-4`}>
                    <Icon className="w-8 h-8 mx-auto mb-2" />
                    <h3 className="text-xl font-semibold text-center">{tile.title}</h3>
                  </div>
                  <p className="text-gray-600 text-center">{tile.description}</p>
                </GlassCard>
              </Link>
            )
          })}
        </div>
      </main>
      
      <QuickNavigation />
    </div>
  )
}
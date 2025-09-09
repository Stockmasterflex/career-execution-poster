'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Filter } from 'lucide-react'
import { companiesRepo, Company, CompanyTier, CompanyStatus } from '@/src/data/companies'
import GlassCard from '@/components/ui/GlassCard'
import Pill from '@/components/ui/Pill'

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [filter, setFilter] = useState<CompanyTier | 'All'>('All')
  const [statusCounts, setStatusCounts] = useState<Record<CompanyStatus, number>>({
    Lead: 0,
    Applied: 0,
    Interview: 0,
    Offer: 0,
    Rejected: 0
  })

  useEffect(() => {
    loadCompanies()
  }, [])

  const loadCompanies = () => {
    const { companiesRepo } = require('@/src/data/companies')
    const allCompanies = companiesRepo.getCompanies()
    setCompanies(allCompanies)
    setStatusCounts(companiesRepo.getStatusCounts())
  }

  const filteredCompanies = filter === 'All' 
    ? companies 
    : companies.filter(company => company.tier === filter)

  const updateStatus = (id: string, status: CompanyStatus) => {
    const { companiesRepo } = require('@/src/data/companies')
    companiesRepo.updateCompany(id, { status })
    loadCompanies()
  }

  const getTierVariant = (tier: CompanyTier) => {
    switch (tier) {
      case 'T1A': return 'phase1'
      case 'T1B': return 'phase2'
      case 'T2': return 'phase3'
      default: return 'default'
    }
  }

  const getStatusColor = (status: CompanyStatus) => {
    switch (status) {
      case 'Lead': return 'text-gray-600'
      case 'Applied': return 'text-blue-600'
      case 'Interview': return 'text-yellow-600'
      case 'Offer': return 'text-green-600'
      case 'Rejected': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Target Companies</h2>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as CompanyTier | 'All')}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Tiers</option>
            <option value="T1A">T1A</option>
            <option value="T1B">T1B</option>
            <option value="T2">T2</option>
          </select>
        </div>
      </div>

      {/* Status Counters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="flex items-center space-x-1">
            <span className="text-sm text-gray-600">{status}:</span>
            <span className="text-sm font-medium text-gray-800">{count}</span>
          </div>
        ))}
      </div>

      {/* Companies List */}
      <div className="space-y-2">
        {filteredCompanies.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No companies found</p>
        ) : (
          filteredCompanies.map(company => (
            <div
              key={company.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Pill variant={getTierVariant(company.tier)} size="sm">
                  {company.tier}
                </Pill>
                <span className="font-medium text-gray-800">{company.name}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <select
                  value={company.status}
                  onChange={(e) => updateStatus(company.id, e.target.value as CompanyStatus)}
                  className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Lead">Lead</option>
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
                
                <span className={`text-sm font-medium ${getStatusColor(company.status)}`}>
                  {company.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </GlassCard>
  )
}

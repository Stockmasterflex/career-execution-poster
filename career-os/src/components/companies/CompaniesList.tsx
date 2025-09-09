'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Building2 } from 'lucide-react'
import { createClient } from '@/lib/supabase-browser'
import type { Database } from '@/lib/database.types'
import CompanyModal from './CompanyModal'

type Company = Database['public']['Tables']['companies']['Row']

const TIER_COLORS = {
  T1A: 'bg-red-600',
  T1B: 'bg-orange-600',
  T2: 'bg-yellow-600',
}

const STATUS_COLORS = {
  Lead: 'bg-gray-600',
  Applied: 'bg-blue-600',
  Interview: 'bg-purple-600',
  Offer: 'bg-green-600',
  Rejected: 'bg-red-600',
}

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'T1A', label: 'T1A' },
  { key: 'T1B', label: 'T1B' },
  { key: 'T2', label: 'T2' },
]

interface CompaniesListProps {
  userId: string
}

export default function CompaniesList({ userId }: CompaniesListProps) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadCompanies()
  }, [userId])

  useEffect(() => {
    filterCompanies()
  }, [companies, activeFilter])

  const loadCompanies = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCompanies(data || [])
    } catch (error) {
      console.error('Error loading companies:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterCompanies = () => {
    if (activeFilter === 'all') {
      setFilteredCompanies(companies)
    } else {
      setFilteredCompanies(companies.filter(company => company.tier === activeFilter))
    }
  }

  const getStatusCounts = () => {
    const counts = {
      Lead: 0,
      Applied: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
    }

    companies.forEach(company => {
      counts[company.status]++
    })

    return counts
  }

  const handleAddCompany = () => {
    setEditingCompany(null)
    setIsModalOpen(true)
  }

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company)
    setIsModalOpen(true)
  }

  const handleSaveCompany = async (companyData: Omit<Company, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingCompany) {
        // Update existing company
        const { error } = await supabase
          .from('companies')
          .update(companyData)
          .eq('id', editingCompany.id)

        if (error) throw error
      } else {
        // Create new company
        const { error } = await supabase
          .from('companies')
          .insert(companyData)

        if (error) throw error
      }

      await loadCompanies()
      setIsModalOpen(false)
      setEditingCompany(null)
    } catch (error) {
      console.error('Error saving company:', error)
    }
  }

  const handleDeleteCompany = async (companyId: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', companyId)

      if (error) throw error
      await loadCompanies()
    } catch (error) {
      console.error('Error deleting company:', error)
    }
  }

  const statusCounts = getStatusCounts()

  if (loading) {
    return (
      <div className="bg-card-bg backdrop-blur-glass border border-border rounded-glass p-6 shadow-card">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded"></div>
          <div className="flex space-x-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 w-16 bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card-bg backdrop-blur-glass border border-border rounded-glass p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-section-title font-semibold text-white">Companies</h2>
        <button
          onClick={handleAddCompany}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Company</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-4">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
              activeFilter === tab.key
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Status Counter Row */}
      <div className="flex items-center space-x-4 mb-6 text-xs">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[status as keyof typeof STATUS_COLORS]}`}></div>
            <span className="text-gray-300">{status}: {count}</span>
          </div>
        ))}
      </div>

      {/* Companies List */}
      <div className="space-y-3">
        {filteredCompanies.length === 0 ? (
          <div className="text-center py-8">
            <Building2 className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No companies yet</h3>
            <p className="text-gray-400 mb-4">Start tracking your target companies</p>
            <button
              onClick={handleAddCompany}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Add your first company
            </button>
          </div>
        ) : (
          filteredCompanies.map((company) => (
            <div
              key={company.id}
              className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${TIER_COLORS[company.tier]}`}>
                    {company.tier}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${STATUS_COLORS[company.status]}`}>
                    {company.status}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-medium">{company.name}</h3>
                  {company.notes && (
                    <p className="text-sm text-gray-400 mt-1">{company.notes}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditCompany(company)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteCompany(company.id)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingCompany(null)
        }}
        onSave={handleSaveCompany}
        company={editingCompany}
      />
    </div>
  )
}
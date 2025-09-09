'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface Company {
  id: string
  name: string
  tier: 'T1A' | 'T1B' | 'T2'
  status: 'lead' | 'applied' | 'interview' | 'offer' | 'rejected'
  notes: string
}

export function TargetCompanies() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadCompanies()
  }, [])

  const loadCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('tier, name')

      if (error) throw error
      setCompanies(data || [])
    } catch (error) {
      console.error('Error loading companies:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateCompanyStatus = async (id: string, status: Company['status']) => {
    try {
      const { error } = await supabase
        .from('companies')
        .update({ status })
        .eq('id', id)

      if (error) throw error

      setCompanies(prev => 
        prev.map(company => 
          company.id === id ? { ...company, status } : company
        )
      )
    } catch (error) {
      console.error('Error updating company status:', error)
    }
  }

  const getTierVariant = (tier: string) => {
    switch (tier) {
      case 'T1A': return 'tier-1a'
      case 'T1B': return 'tier-1b'
      case 'T2': return 'tier-2'
      default: return 'default'
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'offer': return 'success'
      case 'interview': return 'warning'
      case 'applied': return 'default'
      case 'rejected': return 'error'
      default: return 'default'
    }
  }

  const statusOptions: { value: Company['status']; label: string }[] = [
    { value: 'lead', label: 'Lead' },
    { value: 'applied', label: 'Applied' },
    { value: 'interview', label: 'Interview' },
    { value: 'offer', label: 'Offer' },
    { value: 'rejected', label: 'Rejected' },
  ]

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="text-white/60">Loading companies...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Target Companies</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {companies.map((company) => (
            <div key={company.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-white">{company.name}</h4>
                  <Badge variant={getTierVariant(company.tier)}>
                    {company.tier}
                  </Badge>
                  <Badge variant={getStatusVariant(company.status)}>
                    {company.status}
                  </Badge>
                </div>
                {company.notes && (
                  <p className="text-sm text-white/60">{company.notes}</p>
                )}
              </div>
              <div className="flex space-x-1">
                {statusOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={company.status === option.value ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => updateCompanyStatus(company.id, option.value)}
                    className="text-xs"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
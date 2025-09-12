'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { companySchema } from '@/lib/schemas'
import type { Database } from '@/lib/database.types'

type Company = Database['public']['Tables']['companies']['Row']

const TIER_OPTIONS = [
  { value: 'T1A', label: 'T1A', color: 'bg-red-600' },
  { value: 'T1B', label: 'T1B', color: 'bg-orange-600' },
  { value: 'T2', label: 'T2', color: 'bg-yellow-600' },
]

const STATUS_OPTIONS = [
  { value: 'Lead', label: 'Lead', color: 'bg-gray-600' },
  { value: 'Applied', label: 'Applied', color: 'bg-blue-600' },
  { value: 'Interview', label: 'Interview', color: 'bg-purple-600' },
  { value: 'Offer', label: 'Offer', color: 'bg-green-600' },
  { value: 'Rejected', label: 'Rejected', color: 'bg-red-600' },
]

interface CompanyModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<Company, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  company: Company | null
}

export default function CompanyModal({ isOpen, onClose, onSave, company }: CompanyModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    tier: 'T1A' as 'T1A' | 'T1B' | 'T2',
    status: 'Lead' as 'Lead' | 'Applied' | 'Interview' | 'Offer' | 'Rejected',
    notes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        tier: company.tier,
        status: company.status,
        notes: company.notes || '',
      })
    } else {
      setFormData({
        name: '',
        tier: 'T1A',
        status: 'Lead',
        notes: '',
      })
    }
    setErrors({})
  }, [company, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const validatedData = companySchema.parse(formData)
      
      await onSave({
        user_id: company?.user_id || '',
        ...validatedData,
        notes: validatedData.notes || null,
      })
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ general: error.message })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">
            {company ? 'Edit Company' : 'Add Company'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {errors.general && (
            <div className="text-red-400 text-sm">{errors.general}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Company Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="Enter company name"
            />
            {errors.name && <div className="text-red-400 text-xs mt-1">{errors.name}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TIER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleChange('tier', option.value)}
                  className={`p-2 text-xs font-medium rounded border transition-colors ${
                    formData.tier === option.value
                      ? `${option.color} text-white border-transparent`
                      : 'bg-gray-800 text-gray-300 border-gray-600 hover:border-gray-500'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleChange('status', option.value)}
                  className={`p-2 text-xs font-medium rounded border transition-colors ${
                    formData.status === option.value
                      ? `${option.color} text-white border-transparent`
                      : 'bg-gray-800 text-gray-300 border-gray-600 hover:border-gray-500'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="Add any notes about this company..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (company ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
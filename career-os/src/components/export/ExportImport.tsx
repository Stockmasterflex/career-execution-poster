'use client'

import { useState } from 'react'
import { Download, Upload, FileText } from 'lucide-react'
import { exportUserData, importUserData, downloadJSON, uploadJSON } from '@/lib/export'
import type { Database } from '@/lib/database.types'

type UserData = {
  kpis: Database['public']['Tables']['kpis']['Row'][]
  companies: Database['public']['Tables']['companies']['Row'][]
  schedule_blocks: Database['public']['Tables']['schedule_blocks']['Row'][]
  daily_nonnegotiables: Database['public']['Tables']['daily_nonnegotiables']['Row'][]
  daily_tasks: Database['public']['Tables']['daily_tasks']['Row'][]
}
import { exportToPDF, createPDFContent } from '@/lib/pdf-export'

interface ExportImportProps {
  userId: string
  onDataChange: () => void
}

export default function ExportImport({ userId, onDataChange }: ExportImportProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleExportJSON = async () => {
    try {
      setLoading(true)
      setMessage('')
      
      const data = await exportUserData(userId)
      const timestamp = new Date().toISOString().split('T')[0]
      downloadJSON(data, `career-os-export-${timestamp}.json`)
      
      setMessage('Data exported successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Export failed. Please try again.')
      console.error('Export error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImportJSON = async () => {
    try {
      setLoading(true)
      setMessage('')
      
      const data = await uploadJSON() as UserData
      await importUserData(userId, data)
      
      setMessage('Data imported successfully!')
      onDataChange()
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Import failed. Please check your file and try again.')
      console.error('Import error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = async () => {
    try {
      setLoading(true)
      setMessage('')
      
      // Get current data for PDF
      const data = await exportUserData(userId)
      
      // Create a temporary element with the PDF content
      const tempElement = document.createElement('div')
      tempElement.id = 'pdf-content'
      tempElement.innerHTML = createPDFContent({
        kpis: data.kpis,
        companies: data.companies,
        scheduleBlocks: data.schedule_blocks,
        nonNegotiables: data.daily_nonnegotiables,
      })
      tempElement.style.position = 'absolute'
      tempElement.style.left = '-9999px'
      document.body.appendChild(tempElement)
      
      await exportToPDF('pdf-content', `career-os-dashboard-${new Date().toISOString().split('T')[0]}.pdf`)
      
      document.body.removeChild(tempElement)
      setMessage('PDF exported successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('PDF export failed. Please try again.')
      console.error('PDF export error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card-bg backdrop-blur-glass border border-border rounded-glass p-6 shadow-card">
      <h2 className="text-section-title font-semibold text-white mb-6">Export & Import</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-3">
            <Download className="h-5 w-5 text-purple-400" />
            <div>
              <h3 className="text-white font-medium">Export Data</h3>
              <p className="text-sm text-gray-400">Download your data as JSON</p>
            </div>
          </div>
          <button
            onClick={handleExportJSON}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export JSON
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-3">
            <Upload className="h-5 w-5 text-blue-400" />
            <div>
              <h3 className="text-white font-medium">Import Data</h3>
              <p className="text-sm text-gray-400">Upload previously exported JSON</p>
            </div>
          </div>
          <button
            onClick={handleImportJSON}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Import JSON
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-green-400" />
            <div>
              <h3 className="text-white font-medium">Export PDF</h3>
              <p className="text-sm text-gray-400">Generate a PDF report</p>
            </div>
          </div>
          <button
            onClick={handleExportPDF}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export PDF
          </button>
        </div>
      </div>

      {message && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${
          message.includes('successfully') 
            ? 'bg-green-900 text-green-300 border border-green-700' 
            : 'bg-red-900 text-red-300 border border-red-700'
        }`}>
          {message}
        </div>
      )}
    </div>
  )
}
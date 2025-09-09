'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Download, Upload, FileText } from 'lucide-react'
import Link from 'next/link'

export function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  const exportData = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Export all user data
      const tables = ['daily_nonnegotiables', 'daily_tasks', 'kpis', 'companies', 'schedule_blocks', 'success_metrics', 'milestones', 'user_plans']
      const exportData: any = {}

      for (const table of tables) {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .eq('user_id', user.id)

        if (error) throw error
        exportData[table] = data || []
      }

      // Download as JSON
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `career-os-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setMessage('Data exported successfully!')
    } catch (error) {
      console.error('Export error:', error)
      setMessage('Error exporting data')
    } finally {
      setLoading(false)
    }
  }

  const importData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    setMessage('')

    try {
      const text = await file.text()
      const importData = JSON.parse(text)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Import data to each table
      for (const [tableName, records] of Object.entries(importData)) {
        if (Array.isArray(records) && records.length > 0) {
          // Update user_id for all records
          const recordsWithUserId = records.map((record: any) => ({
            ...record,
            user_id: user.id
          }))

          const { error } = await supabase
            .from(tableName)
            .upsert(recordsWithUserId)

          if (error) throw error
        }
      }

      setMessage('Data imported successfully!')
    } catch (error) {
      console.error('Import error:', error)
      setMessage('Error importing data')
    } finally {
      setLoading(false)
    }
  }

  const exportPDF = async () => {
    setLoading(true)
    setMessage('')

    try {
      // Dynamic import of html2pdf
      const html2pdf = (await import('html2pdf.js')).default

      // Get the dashboard content
      const element = document.getElementById('dashboard-content')
      if (!element) throw new Error('Dashboard content not found')

      const opt = {
        margin: 1,
        filename: `career-os-dashboard-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      }

      await html2pdf().set(opt).from(element).save()
      setMessage('PDF exported successfully!')
    } catch (error) {
      console.error('PDF export error:', error)
      setMessage('Error exporting PDF')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Export/Import Section */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-white">Export Data</h3>
                <p className="text-sm text-white/60">
                  Download all your Career OS data as a JSON file for backup or migration.
                </p>
                <Button 
                  onClick={exportData} 
                  disabled={loading}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export JSON
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-white">Import Data</h3>
                <p className="text-sm text-white/60">
                  Upload a previously exported JSON file to restore your data.
                </p>
                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    disabled={loading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button 
                    variant="secondary" 
                    disabled={loading}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import JSON
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-white">Export PDF</h3>
              <p className="text-sm text-white/60">
                Generate a PDF of your current dashboard and Phase 1 data.
              </p>
              <Button 
                onClick={exportPDF} 
                disabled={loading}
                variant="ghost"
                className="w-full"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>

            {message && (
              <div className="p-3 bg-white/10 rounded-lg text-sm text-white/80">
                {message}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-white/60">Version: 1.0.0</p>
              <p className="text-sm text-white/60">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
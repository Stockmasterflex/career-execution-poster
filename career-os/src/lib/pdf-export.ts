import html2pdf from 'html2pdf.js'

export async function exportToPDF(elementId: string, filename: string = 'career-os-dashboard.pdf') {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error('Element not found')
  }

  const opt = {
    margin: 0.5,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true,
      backgroundColor: '#0f172a'
    },
    jsPDF: { 
      unit: 'in', 
      format: 'a4', 
      orientation: 'portrait' 
    }
  }

  try {
    await html2pdf().set(opt).from(element).save()
  } catch (error) {
    console.error('PDF export failed:', error)
    throw new Error('Failed to export PDF')
  }
}

export function createPDFContent(data: {
  kpis: Array<{ name: string; current_value: number; target_value: number }>
  companies: Array<{ name: string; tier: string; status: string; notes?: string | null }>
  scheduleBlocks: Array<{ title: string; tag: string; start_time: string; end_time: string; day: number }>
  nonNegotiables: Array<{ title: string; type: string }>
}) {
  return `
    <div style="font-family: Inter, sans-serif; background: #0f172a; color: #f8fafc; padding: 20px;">
      <h1 style="text-align: center; color: #8b5cf6; margin-bottom: 30px;">Career OS Dashboard</h1>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: #f8fafc; margin-bottom: 15px;">Phase 1 KPIs</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
          ${data.kpis.map(kpi => `
            <div style="background: rgba(11, 16, 32, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 15px;">
              <h3 style="color: #f8fafc; margin-bottom: 10px; font-size: 14px;">${kpi.name}</h3>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #94a3b8;">Progress</span>
                <span style="color: #f8fafc; font-weight: 500;">${kpi.current_value} / ${kpi.target_value}</span>
              </div>
              <div style="background: #374151; height: 8px; border-radius: 4px; overflow: hidden;">
                <div style="background: linear-gradient(90deg, #8b5cf6, #ec4899); height: 100%; width: ${(kpi.current_value / kpi.target_value) * 100}%;"></div>
              </div>
              <div style="text-align: right; font-size: 12px; color: #94a3b8; margin-top: 4px;">
                ${((kpi.current_value / kpi.target_value) * 100).toFixed(1)}%
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #f8fafc; margin-bottom: 15px;">Companies</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
          ${data.companies.map(company => `
            <div style="background: rgba(11, 16, 32, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 15px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <span style="background: ${company.tier === 'T1A' ? '#dc2626' : company.tier === 'T1B' ? '#ea580c' : '#ca8a04'}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">${company.tier}</span>
                <span style="background: ${company.status === 'Lead' ? '#6b7280' : company.status === 'Applied' ? '#2563eb' : company.status === 'Interview' ? '#7c3aed' : company.status === 'Offer' ? '#16a34a' : '#dc2626'}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">${company.status}</span>
              </div>
              <h3 style="color: #f8fafc; margin-bottom: 5px;">${company.name}</h3>
              ${company.notes ? `<p style="color: #94a3b8; font-size: 12px; margin: 0;">${company.notes}</p>` : ''}
            </div>
          `).join('')}
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #f8fafc; margin-bottom: 15px;">Weekly Schedule</h2>
        <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px;">
          ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
            const dayBlocks = data.scheduleBlocks.filter(block => block.day === index)
            return `
              <div style="background: rgba(11, 16, 32, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 10px;">
                <h4 style="color: #f8fafc; text-align: center; margin-bottom: 10px; font-size: 12px;">${day}</h4>
                <div style="space-y: 5px;">
                  ${dayBlocks.map(block => `
                    <div style="background: ${getTagColor(block.tag)}; padding: 5px; border-radius: 4px; margin-bottom: 5px;">
                      <div style="font-size: 10px; color: white; font-weight: 500; margin-bottom: 2px;">${block.tag.toUpperCase()}</div>
                      <div style="font-size: 11px; color: white; font-weight: 500;">${block.title}</div>
                      <div style="font-size: 10px; color: rgba(255, 255, 255, 0.8);">${formatTime(block.start_time)} - ${formatTime(block.end_time)}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `
          }).join('')}
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #f8fafc; margin-bottom: 15px;">Daily Non-Negotiables</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <h3 style="color: #f8fafc; margin-bottom: 10px; font-size: 14px;">Morning Tasks</h3>
            ${data.nonNegotiables.filter(task => task.type === 'morning').map(task => `
              <div style="background: rgba(11, 16, 32, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 6px; padding: 10px; margin-bottom: 5px;">
                <div style="color: #f8fafc; font-size: 12px;">${task.title}</div>
              </div>
            `).join('')}
          </div>
          <div>
            <h3 style="color: #f8fafc; margin-bottom: 10px; font-size: 14px;">Evening Tasks</h3>
            ${data.nonNegotiables.filter(task => task.type === 'evening').map(task => `
              <div style="background: rgba(11, 16, 32, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 6px; padding: 10px; margin-bottom: 5px;">
                <div style="color: #f8fafc; font-size: 12px;">${task.title}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `
}

function getTagColor(tag: string): string {
  const colors = {
    gym: '#f59e0b',
    market: '#0ea5e9',
    study: '#8b5cf6',
    network: '#ec4899',
    content: '#10b981',
    meal: '#64748b',
    family: '#6366f1',
  }
  return colors[tag as keyof typeof colors] || '#6b7280'
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return `${displayHour}:${minutes} ${ampm}`
}
export interface KPI {
  id: string
  name: string
  current: number
  target: number
  unit: string
  phase: number
}

export class KPIRepository {
  private storageKey = 'career_os_kpis'
  
  getDefaultKPIs(): KPI[] {
    return [
      { id: 'cmt-study', name: 'CMT Study', current: 16, target: 100, unit: 'hours', phase: 1 },
      { id: 'networking-dms', name: 'Networking DMs', current: 3, target: 40, unit: 'messages', phase: 1 },
      { id: 'coffee-chats', name: 'Coffee Chats', current: 1, target: 8, unit: 'meetings', phase: 1 },
      { id: 'applications', name: 'Applications', current: 3, target: 50, unit: 'applications', phase: 1 },
      { id: 'linkedin-posts', name: 'LinkedIn Posts', current: 7, target: 40, unit: 'posts', phase: 1 },
      { id: 'website-build', name: 'Website Build', current: 25, target: 100, unit: '%', phase: 1 },
    ]
  }
  
  getKPIs(): KPI[] {
    if (typeof window === 'undefined') return this.getDefaultKPIs()
    
    const stored = localStorage.getItem(this.storageKey)
    if (!stored) {
      const defaultKPIs = this.getDefaultKPIs()
      localStorage.setItem(this.storageKey, JSON.stringify(defaultKPIs))
      return defaultKPIs
    }
    
    return JSON.parse(stored)
  }
  
  updateKPI(id: string, current: number): void {
    if (typeof window === 'undefined') return
    
    const kpis = this.getKPIs()
    const updatedKPIs = kpis.map(kpi => 
      kpi.id === id ? { ...kpi, current } : kpi
    )
    localStorage.setItem(this.storageKey, JSON.stringify(updatedKPIs))
  }
  
  getKPIsByPhase(phase: number): KPI[] {
    return this.getKPIs().filter(kpi => kpi.phase === phase)
  }
}

export const kpiRepo = new KPIRepository()
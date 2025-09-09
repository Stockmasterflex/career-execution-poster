export type CompanyTier = 'T1A' | 'T1B' | 'T2'
export type CompanyStatus = 'Lead' | 'Applied' | 'Interview' | 'Offer' | 'Rejected'

export interface Company {
  id: string
  name: string
  tier: CompanyTier
  status: CompanyStatus
  notes?: string
}

export class CompaniesRepository {
  private storageKey = 'career_os_companies'
  
  getDefaultCompanies(): Company[] {
    return [
      { id: '1', name: 'Goldman Sachs', tier: 'T1A', status: 'Lead', notes: 'Investment banking focus' },
      { id: '2', name: 'JPMorgan Chase', tier: 'T1A', status: 'Lead', notes: 'Trading desk interest' },
      { id: '3', name: 'Morgan Stanley', tier: 'T1A', status: 'Lead', notes: 'Wealth management' },
      { id: '4', name: 'BlackRock', tier: 'T1A', status: 'Lead', notes: 'Asset management' },
      { id: '5', name: 'Vanguard', tier: 'T1A', status: 'Lead', notes: 'Index fund expertise' },
      { id: '6', name: 'Fidelity', tier: 'T1B', status: 'Lead', notes: 'Retail investing' },
      { id: '7', name: 'Charles Schwab', tier: 'T1B', status: 'Lead', notes: 'Discount brokerage' },
      { id: '8', name: 'TD Ameritrade', tier: 'T1B', status: 'Lead', notes: 'Online trading' },
      { id: '9', name: 'E*TRADE', tier: 'T1B', status: 'Lead', notes: 'Digital platform' },
      { id: '10', name: 'Interactive Brokers', tier: 'T1B', status: 'Lead', notes: 'Professional trading' },
      { id: '11', name: 'Robinhood', tier: 'T2', status: 'Lead', notes: 'Mobile-first trading' },
      { id: '12', name: 'SoFi', tier: 'T2', status: 'Lead', notes: 'Fintech platform' },
      { id: '13', name: 'Wealthfront', tier: 'T2', status: 'Lead', notes: 'Robo-advisor' },
      { id: '14', name: 'Betterment', tier: 'T2', status: 'Lead', notes: 'Automated investing' },
      { id: '15', name: 'Acorns', tier: 'T2', status: 'Lead', notes: 'Micro-investing' },
    ]
  }
  
  getCompanies(): Company[] {
    if (typeof window === 'undefined') return this.getDefaultCompanies()
    
    const stored = localStorage.getItem(this.storageKey)
    if (!stored) {
      const defaultCompanies = this.getDefaultCompanies()
      localStorage.setItem(this.storageKey, JSON.stringify(defaultCompanies))
      return defaultCompanies
    }
    
    return JSON.parse(stored)
  }
  
  addCompany(company: Omit<Company, 'id'>): void {
    if (typeof window === 'undefined') return
    
    const companies = this.getCompanies()
    const newCompany: Company = {
      ...company,
      id: Date.now().toString()
    }
    const updatedCompanies = [...companies, newCompany]
    localStorage.setItem(this.storageKey, JSON.stringify(updatedCompanies))
  }
  
  updateCompany(id: string, updates: Partial<Company>): void {
    if (typeof window === 'undefined') return
    
    const companies = this.getCompanies()
    const updatedCompanies = companies.map(company => 
      company.id === id ? { ...company, ...updates } : company
    )
    localStorage.setItem(this.storageKey, JSON.stringify(updatedCompanies))
  }
  
  deleteCompany(id: string): void {
    if (typeof window === 'undefined') return
    
    const companies = this.getCompanies()
    const updatedCompanies = companies.filter(company => company.id !== id)
    localStorage.setItem(this.storageKey, JSON.stringify(updatedCompanies))
  }
  
  getCompaniesByTier(tier?: CompanyTier): Company[] {
    const companies = this.getCompanies()
    return tier ? companies.filter(company => company.tier === tier) : companies
  }
  
  getCompaniesByStatus(status: CompanyStatus): Company[] {
    return this.getCompanies().filter(company => company.status === status)
  }
  
  getStatusCounts(): Record<CompanyStatus, number> {
    const companies = this.getCompanies()
    const counts: Record<CompanyStatus, number> = {
      Lead: 0,
      Applied: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0
    }
    
    companies.forEach(company => {
      counts[company.status]++
    })
    
    return counts
  }
}

export const companiesRepo = new CompaniesRepository()
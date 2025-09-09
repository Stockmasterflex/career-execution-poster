export interface NonNegotiableTask {
  id: string
  text: string
  duration: string
  completed: boolean
}

export interface NonNegotiableSession {
  id: string
  name: string
  tasks: NonNegotiableTask[]
}

export interface DailyNonNegotiables {
  date: string
  morning: NonNegotiableSession
  evening: NonNegotiableSession
  morningCompleted: boolean
  eveningCompleted: boolean
  streak: number
}

export class NonNegotiablesRepository {
  private storageKey = 'career_os_nonnegotiables'
  
  getDefaultSessions(): { morning: NonNegotiableSession, evening: NonNegotiableSession } {
    return {
      morning: {
        id: 'morning',
        name: 'Morning Power Hour',
        tasks: [
          { id: 'market-analysis', text: 'Market analysis + journal', duration: '25m', completed: false },
          { id: 'cmt-study', text: 'CMT study', duration: '25m', completed: false },
          { id: 'linkedin-engagement', text: 'LinkedIn engagement', duration: '10m', completed: false }
        ]
      },
      evening: {
        id: 'evening',
        name: 'Evening Power Hour',
        tasks: [
          { id: 'close-review', text: 'Close review', duration: '20m', completed: false },
          { id: 'outreach-content', text: 'Outreach/content', duration: '25m', completed: false },
          { id: 'goals-review', text: 'Goals review', duration: '15m', completed: false }
        ]
      }
    }
  }
  
  getTodayData(): DailyNonNegotiables {
    if (typeof window === 'undefined') {
      const defaultSessions = this.getDefaultSessions()
      return {
        date: new Date().toISOString().split('T')[0],
        morning: defaultSessions.morning,
        evening: defaultSessions.evening,
        morningCompleted: false,
        eveningCompleted: false,
        streak: 0
      }
    }
    
    const today = new Date().toISOString().split('T')[0]
    const stored = localStorage.getItem(this.storageKey)
    const allData = stored ? JSON.parse(stored) : {}
    
    if (!allData[today]) {
      const defaultSessions = this.getDefaultSessions()
      allData[today] = {
        date: today,
        morning: defaultSessions.morning,
        evening: defaultSessions.evening,
        morningCompleted: false,
        eveningCompleted: false,
        streak: this.calculateStreak(allData)
      }
      localStorage.setItem(this.storageKey, JSON.stringify(allData))
    }
    
    return allData[today]
  }
  
  updateTaskCompletion(date: string, sessionId: string, taskId: string, completed: boolean): void {
    if (typeof window === 'undefined') return
    
    const stored = localStorage.getItem(this.storageKey)
    const allData = stored ? JSON.parse(stored) : {}
    
    if (!allData[date]) {
      const defaultSessions = this.getDefaultSessions()
      allData[date] = {
        date,
        morning: defaultSessions.morning,
        evening: defaultSessions.evening,
        morningCompleted: false,
        eveningCompleted: false,
        streak: 0
      }
    }
    
    const session = allData[date][sessionId]
    if (session) {
      const task = session.tasks.find(t => t.id === taskId)
      if (task) {
        task.completed = completed
      }
      
      // Check if all tasks in session are completed
      const allCompleted = session.tasks.every(t => t.completed)
      allData[date][`${sessionId}Completed`] = allCompleted
      
      // Update streak
      allData[date].streak = this.calculateStreak(allData)
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(allData))
  }
  
  private calculateStreak(allData: Record<string, DailyNonNegotiables>): number {
    const dates = Object.keys(allData).sort().reverse()
    let streak = 0
    
    for (const date of dates) {
      const data = allData[date]
      if (data.morningCompleted && data.eveningCompleted) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }
}

export const nonNegotiablesRepo = new NonNegotiablesRepository()

export interface ScheduleBlock {
  id: string
  title: string
  day: string
  startTime: string
  endTime: string
  color: string
  tag: string
}

export class ScheduleRepository {
  private storageKey = 'career_os_schedule'
  
  getDefaultSchedule(): ScheduleBlock[] {
    return [
      // Monday
      { id: 'monday-gym', title: 'Gym', day: 'Monday', startTime: '06:00', endTime: '07:00', color: 'time-gym', tag: 'Fitness' },
      { id: 'monday-study', title: 'CMT Study', day: 'Monday', startTime: '07:00', endTime: '08:00', color: 'time-study', tag: 'Learning' },
      { id: 'monday-network', title: 'Networking', day: 'Monday', startTime: '08:00', endTime: '09:00', color: 'time-network', tag: 'Networking' },
      { id: 'monday-content', title: 'Content Creation', day: 'Monday', startTime: '09:00', endTime: '10:00', color: 'time-content', tag: 'Content' },
      { id: 'monday-meals', title: 'Meals', day: 'Monday', startTime: '12:00', endTime: '13:00', color: 'time-meals', tag: 'Personal' },
      { id: 'monday-family', title: 'Family Time', day: 'Monday', startTime: '18:00', endTime: '20:00', color: 'time-family', tag: 'Family' },
      
      // Tuesday
      { id: 'tuesday-gym', title: 'Gym', day: 'Tuesday', startTime: '06:00', endTime: '07:00', color: 'time-gym', tag: 'Fitness' },
      { id: 'tuesday-study', title: 'CMT Study', day: 'Tuesday', startTime: '07:00', endTime: '08:00', color: 'time-study', tag: 'Learning' },
      { id: 'tuesday-network', title: 'Networking', day: 'Tuesday', startTime: '08:00', endTime: '09:00', color: 'time-network', tag: 'Networking' },
      { id: 'tuesday-content', title: 'Content Creation', day: 'Tuesday', startTime: '09:00', endTime: '10:00', color: 'time-content', tag: 'Content' },
      { id: 'tuesday-meals', title: 'Meals', day: 'Tuesday', startTime: '12:00', endTime: '13:00', color: 'time-meals', tag: 'Personal' },
      { id: 'tuesday-family', title: 'Family Time', day: 'Tuesday', startTime: '18:00', endTime: '20:00', color: 'time-family', tag: 'Family' },
      
      // Wednesday
      { id: 'wednesday-gym', title: 'Gym', day: 'Wednesday', startTime: '06:00', endTime: '07:00', color: 'time-gym', tag: 'Fitness' },
      { id: 'wednesday-study', title: 'CMT Study', day: 'Wednesday', startTime: '07:00', endTime: '08:00', color: 'time-study', tag: 'Learning' },
      { id: 'wednesday-network', title: 'Networking', day: 'Wednesday', startTime: '08:00', endTime: '09:00', color: 'time-network', tag: 'Networking' },
      { id: 'wednesday-content', title: 'Content Creation', day: 'Wednesday', startTime: '09:00', endTime: '10:00', color: 'time-content', tag: 'Content' },
      { id: 'wednesday-meals', title: 'Meals', day: 'Wednesday', startTime: '12:00', endTime: '13:00', color: 'time-meals', tag: 'Personal' },
      { id: 'wednesday-family', title: 'Family Time', day: 'Wednesday', startTime: '18:00', endTime: '20:00', color: 'time-family', tag: 'Family' },
      
      // Thursday
      { id: 'thursday-gym', title: 'Gym', day: 'Thursday', startTime: '06:00', endTime: '07:00', color: 'time-gym', tag: 'Fitness' },
      { id: 'thursday-study', title: 'CMT Study', day: 'Thursday', startTime: '07:00', endTime: '08:00', color: 'time-study', tag: 'Learning' },
      { id: 'thursday-network', title: 'Networking', day: 'Thursday', startTime: '08:00', endTime: '09:00', color: 'time-network', tag: 'Networking' },
      { id: 'thursday-content', title: 'Content Creation', day: 'Thursday', startTime: '09:00', endTime: '10:00', color: 'time-content', tag: 'Content' },
      { id: 'thursday-meals', title: 'Meals', day: 'Thursday', startTime: '12:00', endTime: '13:00', color: 'time-meals', tag: 'Personal' },
      { id: 'thursday-family', title: 'Family Time', day: 'Thursday', startTime: '18:00', endTime: '20:00', color: 'time-family', tag: 'Family' },
      
      // Friday
      { id: 'friday-gym', title: 'Gym', day: 'Friday', startTime: '06:00', endTime: '07:00', color: 'time-gym', tag: 'Fitness' },
      { id: 'friday-study', title: 'CMT Study', day: 'Friday', startTime: '07:00', endTime: '08:00', color: 'time-study', tag: 'Learning' },
      { id: 'friday-network', title: 'Networking', day: 'Friday', startTime: '08:00', endTime: '09:00', color: 'time-network', tag: 'Networking' },
      { id: 'friday-content', title: 'Content Creation', day: 'Friday', startTime: '09:00', endTime: '10:00', color: 'time-content', tag: 'Content' },
      { id: 'friday-meals', title: 'Meals', day: 'Friday', startTime: '12:00', endTime: '13:00', color: 'time-meals', tag: 'Personal' },
      { id: 'friday-family', title: 'Family Time', day: 'Friday', startTime: '18:00', endTime: '20:00', color: 'time-family', tag: 'Family' },
      
      // Weekend
      { id: 'saturday-focus', title: 'Weekend Focus', day: 'Saturday', startTime: '09:00', endTime: '12:00', color: 'time-study', tag: 'Focus' },
      { id: 'sunday-focus', title: 'Weekend Focus', day: 'Sunday', startTime: '09:00', endTime: '12:00', color: 'time-study', tag: 'Focus' },
    ]
  }
  
  getBlocks(): ScheduleBlock[] {
    if (typeof window === 'undefined') return this.getDefaultSchedule()
    
    const stored = localStorage.getItem(this.storageKey)
    if (!stored) {
      const defaultSchedule = this.getDefaultSchedule()
      localStorage.setItem(this.storageKey, JSON.stringify(defaultSchedule))
      return defaultSchedule
    }
    
    return JSON.parse(stored)
  }
  
  updateBlock(id: string, updates: Partial<ScheduleBlock>): void {
    if (typeof window === 'undefined') return
    
    const blocks = this.getBlocks()
    const updatedBlocks = blocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    )
    localStorage.setItem(this.storageKey, JSON.stringify(updatedBlocks))
  }
  
  addBlock(block: Omit<ScheduleBlock, 'id'>): void {
    if (typeof window === 'undefined') return
    
    const blocks = this.getBlocks()
    const newBlock: ScheduleBlock = {
      ...block,
      id: Date.now().toString()
    }
    const updatedBlocks = [...blocks, newBlock]
    localStorage.setItem(this.storageKey, JSON.stringify(updatedBlocks))
  }
  
  deleteBlock(id: string): void {
    if (typeof window === 'undefined') return
    
    const blocks = this.getBlocks()
    const updatedBlocks = blocks.filter(block => block.id !== id)
    localStorage.setItem(this.storageKey, JSON.stringify(updatedBlocks))
  }
}

export const scheduleRepo = new ScheduleRepository()
export interface FocusItem {
  id: string
  text: string
  completed: boolean
  createdAt: string
}

export class FocusRepository {
  private storageKey = 'career_os_focus'
  
  getItems(): FocusItem[] {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem(this.storageKey)
    return stored ? JSON.parse(stored) : []
  }
  
  addItem(text: string): FocusItem {
    const items = this.getItems()
    const newItem: FocusItem = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date().toISOString()
    }
    const updatedItems = [...items, newItem]
    localStorage.setItem(this.storageKey, JSON.stringify(updatedItems))
    return newItem
  }
  
  updateItem(id: string, updates: Partial<FocusItem>): void {
    const items = this.getItems()
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    )
    localStorage.setItem(this.storageKey, JSON.stringify(updatedItems))
  }
  
  deleteItem(id: string): void {
    const items = this.getItems()
    const updatedItems = items.filter(item => item.id !== id)
    localStorage.setItem(this.storageKey, JSON.stringify(updatedItems))
  }
  
  reorderItems(fromIndex: number, toIndex: number): void {
    const items = this.getItems()
    const [removed] = items.splice(fromIndex, 1)
    items.splice(toIndex, 0, removed)
    localStorage.setItem(this.storageKey, JSON.stringify(items))
  }
}

export const focusRepo = new FocusRepository()
type StorageKey = `kpis:${string}` | `companies:${string}` | `nonneg:${string}` | 
  `schedule:${string}` | `focus:${string}:${string}` | `dailyTasks:${string}:${string}`;

export class MockStore {
  static get<T>(key: StorageKey): T | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static set<T>(key: StorageKey, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  static remove(key: StorageKey): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }

  static clear(prefix: string): void {
    if (typeof window === 'undefined') return;
    const keys = Object.keys(localStorage).filter(key => key.startsWith(prefix));
    keys.forEach(key => localStorage.removeItem(key));
  }
}

export default MockStore;

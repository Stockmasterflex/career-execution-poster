export const isMock = (() => {
  if (typeof window === 'undefined') return false; // Server-side, default to false
  return process.env.NEXT_PUBLIC_USE_MOCK === 'true' ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
})();

export const todayKey = (d = new Date()) =>
  d.toISOString().slice(0, 10); // YYYY-MM-DD

export const storage = {
  get<T>(k: string, fallback: T): T {
    try { 
      const v = localStorage.getItem(k); 
      return v ? JSON.parse(v) as T : fallback; 
    }
    catch { 
      return fallback; 
    }
  },
  set<T>(k: string, v: T) { 
    localStorage.setItem(k, JSON.stringify(v)); 
  },
};
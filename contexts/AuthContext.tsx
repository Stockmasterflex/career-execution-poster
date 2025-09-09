'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

type Ctx = { 
  user: { id: string, email?: string } | null; 
  ready: boolean; 
  loading: boolean;
  signOut: () => Promise<void>;
};
const AuthCtx = createContext<Ctx>({ 
  user: null, 
  ready: false, 
  loading: true,
  signOut: async () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Ctx['user']>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setReady(true);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setReady(true);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();
  };

  return <AuthCtx.Provider value={{ user, ready, loading, signOut }}>{children}</AuthCtx.Provider>;
}
export const useAuth = () => useContext(AuthCtx);

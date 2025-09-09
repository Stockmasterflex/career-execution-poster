'use client';

import { useEffect, useState } from 'react';

export default function DebugAuth() {
  const [mounted, setMounted] = useState(false);
  const [envVars, setEnvVars] = useState<any>({});

  useEffect(() => {
    setMounted(true);
    setEnvVars({
      NEXT_PUBLIC_USE_MOCK: process.env.NEXT_PUBLIC_USE_MOCK,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
    });
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Auth</h1>
      <div className="bg-white p-4 rounded-lg space-y-2">
        <p>Mounted: {mounted ? 'true' : 'false'}</p>
        <p>NEXT_PUBLIC_USE_MOCK: {envVars.NEXT_PUBLIC_USE_MOCK || 'undefined'}</p>
        <p>NEXT_PUBLIC_SUPABASE_URL: {envVars.NEXT_PUBLIC_SUPABASE_URL}</p>
        <p>NEXT_PUBLIC_SUPABASE_ANON_KEY: {envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY}</p>
        <p>Should be Mock: {(!envVars.NEXT_PUBLIC_SUPABASE_URL || !envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY) ? 'YES' : 'NO'}</p>
      </div>
    </div>
  );
}



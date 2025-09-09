'use client';

import { useAuth } from '../../contexts/AuthContext';

export default function TestSimple() {
  const { user, ready } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <div className="bg-white p-4 rounded-lg">
        <p>Ready: {ready ? 'true' : 'false'}</p>
        <p>User: {user ? JSON.stringify(user) : 'null'}</p>
        <p>Mode: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Supabase' : 'Mock'}</p>
      </div>
    </div>
  );
}



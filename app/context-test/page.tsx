'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Define AuthContext within this file
const AuthContext = createContext<{
  user: any;
  ready: boolean;
}>({
  user: null,
  ready: false,
});

// AuthProvider component
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    console.log('AuthProvider useEffect running');
    // Simulate async initialization
    setTimeout(() => {
      setUser({ id: 'test-user', email: 'test@example.com' });
      setReady(true);
      console.log('AuthProvider: User set, ready = true');
    }, 100);
  }, []);

  return (
    <AuthContext.Provider value={{ user, ready }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Test component that uses the context
function TestComponent() {
  const { user, ready } = useAuth();
  
  console.log('TestComponent render:', { user, ready });
  
  if (!ready) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="bg-green-100 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Context Test</h2>
      <p>Ready: {ready ? 'true' : 'false'}</p>
      <p>User: {user ? user.email : 'null'}</p>
    </div>
  );
}

// Main page component
export default function ContextTest() {
  console.log('ContextTest page render');
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Context Test</h1>
      <div className="bg-white p-4 rounded-lg mb-4">
        <p>This page defines and uses AuthContext within the same file.</p>
        <p>If this works, the issue is with the external AuthContext import.</p>
      </div>
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    </div>
  );
}



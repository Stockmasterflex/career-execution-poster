'use client';

import { useState, useEffect } from 'react';

export default function SimpleState() {
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log('SimpleState useEffect running');
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Simple State Test</h1>
      <div className="bg-white p-4 rounded-lg">
        <p>Count: {count}</p>
        <button 
          onClick={() => setCount(count + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Increment
        </button>
        <p className="mt-2">If you can see this and the button works, client-side hydration is working.</p>
      </div>
    </div>
  );
}



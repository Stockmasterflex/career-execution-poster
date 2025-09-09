'use client';

import { useState, useEffect } from 'react';

export default function FinalTest() {
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Final Test</h1>
      <div className="bg-white p-4 rounded-lg">
        <p>Mounted: {mounted ? 'true' : 'false'}</p>
        <p>Count: {count}</p>
        <button 
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Increment
        </button>
      </div>
    </div>
  );
}



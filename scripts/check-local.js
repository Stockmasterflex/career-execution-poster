#!/usr/bin/env node

import http from 'http';

const checkEndpoint = (path) => {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const isStuck = data.includes('Loading...') && data.length < 2000;
        resolve({ 
          path, 
          status: res.statusCode, 
          stuck: isStuck, 
          ok: res.statusCode === 200 && !isStuck,
          size: data.length 
        });
      });
    });
    req.on('error', () => resolve({ path, status: 'error', stuck: false, ok: false }));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ path, status: 'timeout', stuck: false, ok: false });
    });
  });
};

async function healthCheck() {
  console.log('🔍 Checking Career OS health...');
  
  const results = await Promise.all([
    checkEndpoint('/'),
    checkEndpoint('/dashboard'),
    checkEndpoint('/api/health')
  ]);
  
  const allOk = results.every(r => r.ok);
  
  console.log('Results:', results);
  
  if (allOk) {
    console.log('✅ Career OS is running properly');
    process.exit(0);
  } else {
    console.log('❌ Career OS has issues');
    process.exit(1);
  }
}

healthCheck();
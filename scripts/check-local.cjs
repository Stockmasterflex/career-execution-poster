// node scripts/check-local.cjs
const http = require('http');

const PORTS = [3000, 3001, 8080];

function fetchHtml(port) {
  return new Promise((resolve, reject) => {
    http.get({ hostname: 'localhost', port, path: '/', timeout: 4000 }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ port, status: res.statusCode, html: data }));
    }).on('error', reject);
  });
}

(async () => {
  console.log('🔍 Checking Career OS app...');
  
  for (const port of PORTS) {
    try {
      const { status, html } = await fetchHtml(port);
      if (status >= 200 && status < 400) {
        const ok =
          /Career OS Dashboard/i.test(html) ||
          /Sign In/i.test(html) ||
          /Sign in to Career OS/i.test(html);
        const stuck = /Loading\.\.\./i.test(html);
        
        if (ok && !stuck) {
          console.log(`✅ Career OS running successfully on port ${port}`);
          console.log(`🌐 Visit: http://localhost:${port}`);
          console.log(JSON.stringify({ port, status, ok, stuck }, null, 2));
          process.exit(0);
        }
      }
    } catch {}
  }
  
  console.log('❌ Career OS not responding on any port');
  console.log(JSON.stringify({ error: 'No local server responding' }, null, 2));
  process.exit(2);
})();

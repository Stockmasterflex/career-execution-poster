import http from 'node:http';

function get(url) {
  return new Promise(res => {
    http.get(url, r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => res({ s: r.statusCode, b: d }));
    }).on('error', e => res({ s: 0, b: String(e) }));
  });
}

const page = await get('http://localhost:3000');
if (page.s !== 200) { 
  console.error('Page not 200', page.s); 
  process.exit(1); 
}
if (/Loading/i.test(page.b)) { 
  console.error('Still loading, not hydrated'); 
  process.exit(2); 
}
const health = await get('http://localhost:3000/api/health');
console.log('Health:', health.b);
process.exit(0);



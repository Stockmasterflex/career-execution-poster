const puppeteer = require('puppeteer');

(async () => {
  const url = process.env.POSTER_URL || 'http://localhost:8080/poster/';
  const out = process.env.POSTER_OUT || 'poster.pdf';
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: out,
    printBackground: true,
    preferCSSPageSize: true
  });
  await browser.close();
  console.log('✅ Wrote', out);
})();

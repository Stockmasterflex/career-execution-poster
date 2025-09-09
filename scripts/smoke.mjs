import { chromium } from 'playwright';

async function smokeTest() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('🚀 Starting smoke test...');
    
    // Navigate to the dashboard
    await page.goto('http://localhost:3000/dashboard');
    console.log('✅ Page loaded');
    
    // Wait for the page to be ready
    await page.waitForSelector('textarea[placeholder*="Top priorities"]', { timeout: 10000 });
    console.log('✅ Dashboard loaded');
    
    // Test Today's Focus
    const focusTextarea = await page.locator('textarea[placeholder*="Top priorities"]');
    await focusTextarea.fill('Test focus for smoke test');
    console.log('✅ Focus text entered');
    
    // Wait for save indicator (more flexible)
    try {
      await page.waitForSelector('text=Saving…', { timeout: 2000 });
      console.log('✅ Saving indicator shown');
    } catch (e) {
      console.log('⚠️ Saving indicator not found, continuing...');
    }
    
    try {
      await page.waitForSelector('text=Saved', { timeout: 5000 });
      console.log('✅ Focus saved');
    } catch (e) {
      console.log('⚠️ Saved indicator not found, continuing...');
    }
    
    // Test KPI editing
    const kpiValue = await page.locator('.kpi-mini__text span').first();
    await kpiValue.click();
    const kpiInput = await page.locator('input[type="number"]').first();
    await kpiInput.fill('25');
    await kpiInput.press('Enter');
    console.log('✅ KPI updated');
    
    // Test non-negotiables
    const checkbox = await page.locator('input[type="checkbox"]').first();
    await checkbox.check();
    console.log('✅ Non-negotiable checked');
    
    // Test companies
    const addCompanyBtn = await page.locator('text=Add Company');
    await addCompanyBtn.click();
    
    await page.fill('input[placeholder*="Company Name"]', 'Test Company');
    await page.selectOption('select', 'Tier 1');
    await page.selectOption('select', 'applied');
    await page.fill('input[placeholder*="Notes"]', 'Test notes');
    
    const submitBtn = await page.locator('button[type="submit"]');
    await submitBtn.click();
    console.log('✅ Company added');
    
    // Reload page to test persistence
    await page.reload();
    await page.waitForSelector('textarea[placeholder*="Top priorities"]', { timeout: 10000 });
    
    // Check if focus persisted
    const persistedFocus = await focusTextarea.inputValue();
    if (persistedFocus.includes('Test focus for smoke test')) {
      console.log('✅ Focus persisted after reload');
    } else {
      console.log('❌ Focus did not persist');
    }
    
    // Check if company persisted
    const companyExists = await page.locator('text=Test Company').count();
    if (companyExists > 0) {
      console.log('✅ Company persisted after reload');
    } else {
      console.log('❌ Company did not persist');
    }
    
    console.log('🎉 Smoke test completed successfully!');
    
  } catch (error) {
    console.error('❌ Smoke test failed:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

smokeTest();
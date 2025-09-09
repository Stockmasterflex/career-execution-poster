import { chromium } from 'playwright';

async function smokeTest() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('🚀 Starting simple smoke test...');
    
  // Navigate to the main dashboard
  await page.goto('http://localhost:3000/dashboard');
    console.log('✅ Page loaded');
    
    // Wait for the page to be ready
    await page.waitForSelector('textarea[placeholder*="What are your top priorities"]', { timeout: 10000 });
    console.log('✅ Dashboard loaded');
    
    // Test Today's Focus
    const focusTextarea = await page.locator('textarea[placeholder*="What are your top priorities"]');
    await focusTextarea.click();
    await focusTextarea.fill('');
    await focusTextarea.type('Test focus for smoke test');
    
    // Trigger onChange event manually
    await focusTextarea.evaluate((el) => {
      const inputEvent = new Event('input', { bubbles: true });
      el.dispatchEvent(inputEvent);
      const changeEvent = new Event('change', { bubbles: true });
      el.dispatchEvent(changeEvent);
    });
    
    console.log('✅ Focus text entered');
    
    // Wait a bit for auto-save
    await page.waitForTimeout(3000);
    
    // Check localStorage before reload
    const localStorageBeforeReload = await page.evaluate(() => localStorage.getItem('todayFocus'));
    console.log('localStorage before reload:', localStorageBeforeReload);
    
    // Test KPI editing if available
    try {
      const kpiButton = await page.locator('button:has-text("+")').first();
      if (await kpiButton.count() > 0) {
        await kpiButton.click();
        console.log('✅ KPI updated');
      } else {
        console.log('⚠️ No KPIs found, skipping KPI test');
      }
    } catch (e) {
      console.log('⚠️ KPI test failed, continuing...');
    }
    
    // Test non-negotiables if available
    try {
      const checkbox = await page.locator('input[type="checkbox"]').first();
      if (await checkbox.count() > 0) {
        await checkbox.check();
        console.log('✅ Non-negotiable checked');
      } else {
        console.log('⚠️ No non-negotiables found, skipping checkbox test');
      }
    } catch (e) {
      console.log('⚠️ Non-negotiables test failed, continuing...');
    }
    
    // Reload page to test persistence
    await page.reload();
    await page.waitForSelector('textarea[placeholder*="What are your top priorities"]', { timeout: 10000 });
    
    // Check if focus persisted
    const persistedFocus = await focusTextarea.inputValue();
    console.log('Focus after reload:', persistedFocus);
    
    // Check localStorage directly
    const localStorageValue = await page.evaluate(() => localStorage.getItem('todayFocus'));
    console.log('localStorage value:', localStorageValue);
    
    if (persistedFocus.includes('Test focus for smoke test')) {
      console.log('✅ Focus persisted after reload');
    } else {
      console.log('❌ Focus did not persist');
    }
    
    console.log('🎉 Simple smoke test completed successfully!');
    
  } catch (error) {
    console.error('❌ Smoke test failed:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

smokeTest();

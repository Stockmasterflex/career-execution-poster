#!/usr/bin/env node

import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

async function exportPDF() {
  console.log('🚀 Starting PDF export for Career Execution Poster...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set viewport for optimal digital viewing
    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 2
    });
    
    // Load the poster page
    const posterUrl = `file://${join(projectRoot, '_site', 'poster', 'index.html')}`;
    console.log(`📄 Loading: ${posterUrl}`);
    
    await page.goto(posterUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // Wait for fonts and images to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate PDF with digital-optimized settings
    const pdfPath = join(projectRoot, 'Career-Execution-Poster.pdf');
    
    console.log('📊 Generating PDF...');
    
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      },
      preferCSSPageSize: false,
      displayHeaderFooter: false
    });
    
    console.log(`✅ PDF exported successfully: ${pdfPath}`);
    console.log('📱 Optimized for digital viewing on desktop, tablet, and mobile');
    
  } catch (error) {
    console.error('❌ Error exporting PDF:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

exportPDF();

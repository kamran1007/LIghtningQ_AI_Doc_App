// // src/utils/pdf-generator.util.ts
// import * as puppeteer from 'puppeteer';

// export async function generatePdfFromHtml(html: string): Promise<Buffer> {
//   const browser = await puppeteer.launch({
//     headless: true,
//     args: ['--no-sandbox', '--disable-setuid-sandbox'],
//   });
//   const page = await browser.newPage();
//   await page.setContent(html, { waitUntil: 'networkidle0' });
//   const pdfUint8Array = await page.pdf({ format: 'A4' });
//   await browser.close();
//   return Buffer.from(pdfUint8Array);
// }

// src/utils/pdf-generator.util.ts
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export async function generatePdfFromHtml(html: string): Promise<Buffer> {
  let browser;
  try {
    console.log('🧩 [PDF] Launching Puppeteer...');

    // Detect environment
    const isProduction = process.env.NODE_ENV === 'production';
    const isRender = process.env.RENDER === 'true';

    let launchOptions;

    if (isProduction || isRender) {
      // Production/Render: Use @sparticuz/chromium
      launchOptions = {
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
      };
    } else {
      // Local development: Use puppeteer with auto-detection
      const puppeteerFull = await import('puppeteer');
      launchOptions = {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
        ],
      };
      
      // Use full puppeteer for local dev (it will auto-download Chrome)
      browser = await puppeteerFull.default.launch(launchOptions);
      
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20px', bottom: '20px', left: '15px', right: '15px' },
      });

      await browser.close();
      console.log('✅ [PDF] PDF generated successfully');
      return Buffer.from(pdf);
    }

    // Production path
    browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '15px', right: '15px' },
    });

    await browser.close();
    console.log('✅ [PDF] PDF generated successfully');
    return Buffer.from(pdf);
  } catch (error) {
    console.error('❌ [PDF] Puppeteer PDF generation failed:', error);
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }
    return Buffer.alloc(0);
  }
}
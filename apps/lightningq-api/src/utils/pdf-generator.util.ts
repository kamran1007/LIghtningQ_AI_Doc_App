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

    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
    });

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
    if (browser) await browser.close();
    return Buffer.alloc(0);
  }
}
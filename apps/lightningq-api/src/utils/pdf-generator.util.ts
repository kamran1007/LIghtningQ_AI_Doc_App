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
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

export async function generatePdfFromHtml(html: string): Promise<Buffer> {
  try {
    console.log('🧩 [PDF] Launching Puppeteer...');

    let executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;

    // Auto-detect Chromium path for Render
    if (
      !executablePath &&
      fs.existsSync('/opt/render/.cache/puppeteer/chrome')
    ) {
      const dirs = fs.readdirSync('/opt/render/.cache/puppeteer/chrome');
      const chromeDir = dirs.find((d) => d.startsWith('linux-'));
      if (chromeDir) {
        executablePath = path.join(
          '/opt/render/.cache/puppeteer/chrome',
          chromeDir,
          'chrome-linux64/chrome',
        );
      }
    }

    console.log(
      '✅ [PDF] Chromium executable path:',
      executablePath || '(default)',
    );

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: executablePath || undefined,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-extensions',
        '--no-zygote',
        '--disable-software-rasterizer',
        '--disable-background-timer-throttling',
        '--disable-renderer-backgrounding',
      ],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000)); // wait for layout rendering

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '20px', bottom: '20px', left: '15px', right: '15px' },
    });

    await browser.close();
    console.log('✅ [PDF] PDF generated successfully');
    return Buffer.from(pdf);
  } catch (error) {
    console.error('❌ [PDF] Puppeteer PDF generation failed:', error);
    return Buffer.alloc(0);
  }
}

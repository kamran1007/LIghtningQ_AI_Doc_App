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

export async function generatePdfFromHtml(html: string): Promise<Buffer> {
  try {
    console.log('🧩 [PDF] Launching Puppeteer...');

    // 🧩 Determine executable path dynamically
    let executablePath: string | undefined;
    try {
      executablePath = puppeteer.executablePath(); // returns string
    } catch {
      executablePath =
        '/opt/render/.cache/puppeteer/chrome/linux-138.0.7204.168/chrome-linux64/chrome';
    }

    console.log('✅ [PDF] Using Chrome path:', executablePath);

    const browser = await puppeteer.launch({
      headless: true,
      executablePath,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process',
        '--no-zygote',
      ],
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
    return Buffer.alloc(0);
  }
}

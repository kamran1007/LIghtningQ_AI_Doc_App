// src/utils/pdf-generator.util.ts
import * as puppeteer from 'puppeteer';

export async function generatePdfFromHtml(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfUint8Array = await page.pdf({ format: 'A4' });
  await browser.close();
  return Buffer.from(pdfUint8Array);
}

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
import puppeteer from "puppeteer";

export async function generatePdfFromHtml(html: string): Promise<Buffer> {
  try {
    console.log("🧩 [PDF] Launching Puppeteer...");
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();
    console.log("✅ [PDF] PDF generated successfully");
    return Buffer.from(pdf);
  } catch (error) {
    console.error("❌ [PDF] Puppeteer PDF generation failed:", error);
    return Buffer.alloc(0);
  }
}


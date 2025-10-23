// src/utils/pdf-generator.util.ts
import puppeteer from "puppeteer";

/**
 * Generates a PDF buffer from HTML content.
 * Works both locally and on Render.
 */
export async function generatePdfFromHtml(html: string): Promise<Buffer | null> {
  try {
    console.log("🧩 [PDF] Starting Puppeteer...");

    // ✅ Let Puppeteer use its bundled Chromium
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-zygote",
        "--single-process",
      ],
    });

    console.log("✅ [PDF] Chromium launched successfully");

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", bottom: "20px", left: "10px", right: "10px" },
    });

    await browser.close();
    console.log("✅ [PDF] PDF generated successfully");

    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error("❌ [PDF] Puppeteer PDF generation failed:", error);
    return null; // Prevent crash if Puppeteer fails
  }
}

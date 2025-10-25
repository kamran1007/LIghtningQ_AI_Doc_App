// apps/lightningq-api/scripts/install-chrome.js
import puppeteer from "puppeteer";
import fs from "fs";

(async () => {
  console.log("🔧 Installing Chromium for Puppeteer...");

  try {
    const browserFetcher = puppeteer.createBrowserFetcher();
    const revisionInfo = await browserFetcher.download("1195492"); // stable revision
    console.log("✅ Chromium installed at:", revisionInfo.executablePath);

    // Ensure path is visible to Puppeteer at runtime
    const chromeDir = revisionInfo.executablePath.split("/chrome")[0];
    if (fs.existsSync(chromeDir)) {
      console.log("🧩 Chromium directory:", chromeDir);
    }

    console.log("✅ Puppeteer setup complete.");
  } catch (err) {
    console.error("❌ Failed to install Chromium:", err);
    process.exit(1);
  }
})();

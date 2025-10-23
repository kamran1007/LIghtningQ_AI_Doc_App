// scripts/install-chrome.js
import { execSync } from "child_process";

try {
  console.log("🚀 Installing Puppeteer Chrome for Render...");
  execSync("npx puppeteer browsers install chrome", { stdio: "inherit" });
  console.log("✅ Chrome installation completed successfully!");
} catch (err) {
  console.error("❌ Chrome installation failed:", err);
}

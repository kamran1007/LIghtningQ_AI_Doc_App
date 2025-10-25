import puppeteer from 'puppeteer';

(async () => {
  console.log('🔧 Installing Chromium for Puppeteer...');

  try {
    // This will download Chrome to the cache
    const browserFetcher = puppeteer.createBrowserFetcher({
      path: process.env.PUPPETEER_CACHE_DIR || '/opt/render/.cache/puppeteer',
    });

    // Use a stable revision that matches your puppeteer version
    const revisionInfo = await browserFetcher.download('1368088'); // Chrome 138

    console.log('✅ Chromium installed at:', revisionInfo.executablePath);
    console.log('✅ Puppeteer setup complete.');
  } catch (err) {
    console.error('❌ Failed to install Chromium:', err);
    process.exit(1);
  }
})();

const { chromium } = require('playwright');

(async () => {
    // Launch a new browser instance
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Navigate to DuckDuckGo
    await page.goto('https://duckduckgo.com');

    // Perform a search
    await page.fill('input[name="q"]', 'Playwright');
    await page.press('input[name="q"]', 'Enter');

    // Wait for search results to load
    await page.waitForSelector('#links');

    // Verify that the search results contain the term "Playwright"
    const pageContent = await page.textContent('body');
    if (pageContent.includes('Playwright')) {
        console.log('✅ Search results contain the term "Playwright".');
    } else {
        console.error('❌ Search results do not contain the term "Playwright".');
    }

    // Close the browser
    await browser.close();
})();
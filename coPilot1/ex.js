const { chromium } = require('playwright');

(async () => {
    // Launch a new browser instance
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Navigate to example.com
    await page.goto('https://example.com');

    // Verify the page title
    const pageTitle = await page.title();
    console.log('Page Title:', pageTitle);
    if (pageTitle === 'Example Domain') {
        console.log('✅ Page title is correct.');
    } else {
        console.error('❌ Page title is incorrect.');
    }

    // Click the "More information..." link
    await page.click('a:has-text("More information...")');

    // Wait for navigation to complete
    await page.waitForLoadState('domcontentloaded');

    // Verify the new page contains specific text
    const pageContent = await page.textContent('body');
    if (pageContent.includes('IANA-managed Reserved Domains')) {
        console.log('✅ The new page contains the expected text.');
    } else {
        console.error('❌ The new page does not contain the expected text.');
    }

    // Close the browser
    await browser.close();
})();
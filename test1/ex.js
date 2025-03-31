const { chromium } = require('playwright');

(async () => {

    // Launch a new Browser Instance. Mjm
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Navigate to a website. Mjm
    await page.goto('https://example.com');

    // Output the page title. Mjm
    console.log('Page Title:', await page.title());

    // Close the browser. Mjm
    await browser.close();

})()
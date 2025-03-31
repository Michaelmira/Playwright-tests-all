const { chromium } = require('playwright');

(async () => {

    const browser = await chromium.launch({headless: true});
    const page = await browser.newPage();

    await page.goto("https://devmentor-frontend.onrender.com/");


    console.log('Page Title:', await page.title());
    console.log('We have arrived at:', page.url());

    await page.click('.navbar-dropdown .btn');
    await page.waitForTimeout(1000);

    await page.click('[data-test="customer-login-button"]');

    await page.fill('[data-test="customer-login-email-input"]', 'badlandsbordello2022@gmail.com' );
    await page.fill('[data-test="customer-login-password-input"]', 'mjm123' );

    await page.click('[data-test="customer-login-submit-button"]')

    // Wait for navigation after login (adjust if needed)
    await page.waitForTimeout(3000); // Or use page.waitForNavigation()

    console.log('Current URL after login:', page.url());

    await browser.close();

})()
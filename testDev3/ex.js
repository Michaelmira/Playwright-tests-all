const { chromium } = require('playwright');

(async () => {

    const browser = await chromium.launch({headless: true});
    const page = await browser.newPage();

    await page.goto("https://devmentor-frontend.onrender.com/");


    console.log('Page Title:', await page.title());
    console.log('We have arrived at:', page.url());

    await page.click('.navbar-dropdown .btn');
    await page.waitForTimeout(1000);

    await page.click('[data-test="customer-signup-button"]');

    await page.fill('#input-email', 'PlayWrightTest@gmail.com' );
    await page.fill('#input-password', 'mjm123' );
    await page.fill('#input-password-2', 'mjm123' );
    await page.fill('#input-first-name', 'Play' );
    await page.fill('#input-last-name', 'Wright' );

    // await page.locator('#input-phone').click();
    // await page.fill('#input-phone', '5108232323' );
    await page.locator('#input-phone').fill('+14155552671');

    //Await The Confirmation Alert Mjm
    const alertPromise = page.waitForEvent('dialog');

    await page.click('#submit-signup');

    // Handle the alert after clicking submit Mjm
    const dialog = await alertPromise;
    console.log(`Alert message: ${dialog.message()}`);
    await dialog.accept(); 

    // Wait a second for modal to load Mjm
    await page.waitForTimeout(1000);

    await page.fill('[data-test="customer-login-email-input"]', 'PlayWrightTest@gmail.com' );
    await page.fill('[data-test="customer-login-password-input"]', 'mjm123' );

    await page.click('[data-test="customer-login-submit-button"]')


    // Wait for navigation after login (adjust if needed)
    await page.waitForTimeout(3000); // Or use page.waitForNavigation()

    console.log('Current URL after login:', page.url());

    await browser.close();

})()
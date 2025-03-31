const { chromium } = require('playwright'); 

(async () => {
    // Launch a new browser instance. Mjm
    const browser = await chromium.launch({ headless: true  }) // Open browser in non headless mode
    const page = await browser.newPage();

    // Navigate to a demo login page. Mjm
    await page.goto('https://www.saucedemo.com/');

    // Fill in the Login Form. Mjm 
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');

    // Click the login button. Mjm
    await page.click('#login-button');

    // Wait for navigation to complete. Mjm 
    await page.waitForSelector('.inventory_list');

    // Extract and Log the first item's name. Mjm
    const firstItemName = await page.textContent('.inventory_item_name');
    console.log('First Item Name:', firstItemName );

    // Close the browser. Mjm
    await browser.close();
})();
const { chromium } = require('playwright');

(async () => {
    // Launch browser in headless mode
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Navigate to login page
    await page.goto('https://www.saucedemo.com/');

    // Log in
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');

    // Wait for the inventory page to load
    await page.waitForSelector('.inventory_list');

    // Add the first item to the cart
    await page.click('.inventory_item:nth-child(1) .btn_inventory');

    // Navigate to the cart
    await page.click('.shopping_cart_link');
    await page.waitForSelector('.cart_item');

    // Extract the item name from the cart
    const cartItemName = await page.textContent('.inventory_item_name');

    // Assert that the cart contains the correct item
    if (cartItemName) {
        console.log('✅ Item successfully added to the cart:', cartItemName);
    } else {
        console.error('❌ Item not found in the cart');
    }

    // Close browser
    await browser.close();
})();

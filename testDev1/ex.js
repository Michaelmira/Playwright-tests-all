const { chromium } = require('playwright');

(async () => {

    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto("https://devmentor-frontend.onrender.com/");

    console.log('Page Title:', await page.title());

    await browser.close();

})()
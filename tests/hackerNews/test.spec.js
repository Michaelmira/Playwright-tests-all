

const { test, expect } = require('@playwright/test');
const { title } = require('process');

// To run you may new to do thhis npm install
// npm install @playwright/test --save-dev

// Run test in bash from /tests/hackerNews
// npx playwright test tests/hackerNews

test('Hacker News Test Suite', async ({ page }) => {
    let totalTests = 0
    let totalTestsPassed = 0
    const startTime = Date.now();

    // Navigate to Hacker News
    await page.goto('https://news.ycombinator.com/newest');




    totalTests++
    // Test 1: correct URL. mjm 
    await expect(page).toHaveURL('https://news.ycombinator.com/newest')
    console.log("✅ Test 1 Passed: URL is correct.");
    totalTestsPassed++




    totalTests++
    // Test 2: correct Title. mjm
    await expect(page).toHaveTitle('New Links | Hacker News')
    console.log("✅ Test 2 Passed: Title is correct.");
    totalTestsPassed++




    totalTests++
    // Test 3: Ensure the first title element is visible and contains text. mjm
    await page.waitForSelector(".athing")

    // Locate the First Title by CSS .titleline child <a> . mjm
    const firstTitleElement = page.locator('.titleline a').first();

    // Assert that the first title element is visible and contains text mjm
    await expect(firstTitleElement).toBeVisible();
    await expect(firstTitleElement).toHaveText(/.+/);
    const firstTitleText = await firstTitleElement.textContent();
    console.log(`✅ Test 3 passed: Here is the latest article title: ${firstTitleText} `);
    totalTestsPassed++


    totalTests++
    // Test 3.1: Locate, format and validate date mjm
    const firstAgeElement = page.locator('.age').first();
    const firstDateCreatedText = await firstAgeElement.getAttribute('title')
    const firstDateString = firstDateCreatedText.split(' ')[0];
    const firstDate = new Date(firstDateString)

    // Assert that the date is a valid format for comparison.
    expect(firstDate.toISOString().split('T')[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/); // Regex
    console.log('✅ Test 3.1 passed: Date format validated for first Post:', firstDate)
    totalTestsPassed++


    totalTests++
    // Test 3.2: Ensure the last title element is visible and contains text. mjm
    // Locate the last Title by CSS .titleline child <a> . mjm
    const lastTitleElement = page.locator('.titleline a').last();

    // Assert that the last title element is visible and contains text. mjm
    await expect(lastTitleElement).toBeVisible();
    await expect(lastTitleElement).toHaveText(/.+/);
    const lastTitleText = await lastTitleElement.textContent();
    console.log(`✅ Test 3.2 passed: Here is the last articles title: ${lastTitleText} `);
    totalTestsPassed++


    totalTests++
    // Test 3.3: Ensure the last post is older then the first post. mjm
    const lastAgeElement = page.locator('.age').last();
    const lastDateCreatedText = await lastAgeElement.getAttribute('title')
    const lastDateString = lastDateCreatedText.split(' ')[0];
    const lastDate = new Date(lastDateString)

    // Assert that the date is a valid format for comparison. mjm
    expect(lastDate.toISOString().split('T')[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    console.log('✅ Test 3.3 passed: Date format validated for last Post:', lastDate)
    totalTestsPassed++

    totalTests++
    // Test 3.4: Assert test that the first post is newer then the last post. mjm
    await expect(firstDate.getTime()).toBeGreaterThan(lastDate.getTime());  // NOTE: Newer is greater then.
    console.log("✅ Test 3.4 passed: The first post is newer than the last post.");
    totalTestsPassed++





    totalTests++
    // Test 4: Check 100 posts that they are in order by date. mjm
    const ageElements = page.locator('.age');
    await expect(ageElements).toHaveCount(30);
    const ageElementsArray = await ageElements.all();
    console.log(`✅ Test 4 passed: Expected 30 elements, recieved ${ageElementsArray.length}`);
    totalTestsPassed++



    /**  
    * Checks if posts are in chronological order by comparing timestamps.  
    * Logs results for each page and tracks total posts checked.  
    */

    let totalPostsChecked = 0;
    let pageCount = 0;
    const chronologicalTest = async (numberToTest) => {


        for (let i = 0; i < numberToTest - 1; i++) {

            let prevDate = await ageElementsArray[i].getAttribute('title');// Get the i-th message mjm
            let nextDate = await ageElementsArray[i + 1].getAttribute('title');// Get the i-th message mjm
            let prevFormattedDate = prevDate.split(' ')[0];
            let nextFormattedDate = nextDate.split(' ')[0]; 
            let prevDateObject = new Date(prevFormattedDate)
            let nextDateObject = new Date(nextFormattedDate)

            await expect.soft(prevDateObject.getTime(),
                `Post at index ${i} (${prevFormattedDate}) should be earlier than post at index ${i + 1} (${nextFormattedDate})`
            ).toBeGreaterThanOrEqual(nextDateObject.getTime());

            totalPostsChecked++;
        }
        totalPostsChecked++;
        pageCount++
        console.log(`✅ Test 4.${pageCount} passed: Page ${pageCount}: Checked ${totalPostsChecked} posts for reverse chronological order`);


    }
    totalTests++
    await chronologicalTest(ageElementsArray.length)
    totalTestsPassed++

    await page.click('a.morelink');

    const currentURL = page.url();

    console.log(`✅ Current URL: "${currentURL}"`);

    totalTests++
    await chronologicalTest(ageElementsArray.length)
    totalTestsPassed++

    await page.click('a.morelink');

    totalTests++
    await chronologicalTest(ageElementsArray.length)
    totalTestsPassed++

    await page.click('a.morelink');

    totalTests++
    await chronologicalTest(100 - totalPostsChecked)
    totalTestsPassed++



    await expect(totalTestsPassed).toBe(totalTests);
    console.log(`✅ Test Summary: ${totalTestsPassed} out of ${totalTests} passed successfully.`);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`🏁 Tests completed in ${duration} seconds`);

    console.log("\n")
});

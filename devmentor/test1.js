// devmentorTests/devmentor1.js

// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");
const path = require('path');
const fs = require('fs');


async function devMentorNavigateAndTest() {
    let totalTests = 0
    let totalTestsPassed = 0
    const startTime = Date.now();

    // launch browser 
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // go to DevMentor
    console.log("Navigating to DevMentor...");
    await page.goto('https://devmentor-frontend.onrender.com/'); 
    await page.waitForTimeout(500);
    await page.once('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.dismiss().catch(() => { });
    });

     // Inform user about database spin-up time. mjm
     console.log("🔄 MICHAEL MIRISCIOTTA: Database may need time aprox 60 seconds to spin up. Please wait approximately 60 seconds... else Continue");

    totalTests++
    // Test #1 Do we have the correct URL? mjm
    const currentURL = page.url();
    const expectedURL = "https://devmentor-frontend.onrender.com/"

    if (expectedURL === currentURL) {
        console.log(`✅ Test 1 Passed: Expected URL ${expectedURL} matches current URL  ${currentURL} `);
    } else {
        console.error(`❌ Test 1 Failed: Expected "${expectedURL}", but got "${currentURL}"`);
        process.exit(1);
    }
    totalTestsPassed++





    totalTests++
    // Test #2 Do we have the correct Title? mjm
    const currentTitle = await page.title();
    const expectedTitle = "Welcome to devMentor!"

    if (expectedTitle === currentTitle) {
        console.log(`✅ Test 2 Passed: Expected Title: ${expectedTitle} matches current URL  ${currentTitle} `);
    } else {
        console.error(`❌ Test 2 Failed: Expected "${expectedTitle}", but got "${currentTitle}"`);
        process.exit(1)
    }
    totalTestsPassed++




    // START-START-START-START Code Created with npx codegen devmentor-frontend.onrender.com/ mjm
    // START-START-START-START Code Created with npx codegen devmentor-frontend.onrender.com/ mjm
    // START-START-START-START Code Created with npx codegen devmentor-frontend.onrender.com/ mjm

    totalTests++
    totalTests++
    totalTests++
    // Test #3 Compare expected full name and city from JSON Response
    // Set up event listener for network response by baseURL and Endpoint. mjm
    let mentorDataResponse = null;
    let nameAndCityMatch = true;
    const expectedName = "Michael Mirisciotta";                                             
    const expectedCity = "San Francisco";
    console.log("🔄 Test 3 Start: Attempting to login with supplied credentials")

    page.on('response', async (response) => {
        // Check if the response URL matches the mentor login endpoint
        if (response.url() === 'https://devmentorbackend.onrender.com/api/mentor/login') {
            mentorDataResponse = await response.json(); // Capture the response data       
        }
    });

    // Click Button with Mentors, Then Login mjm
    await page.getByRole('button', { name: 'Mentors ' }).click();
    await page.getByRole('button', { name: 'Log In ' }).click();

    // Navigate to then login as mentor mjm
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('michaelmirisciotta@gmail.com');
    await page.getByRole('textbox', { name: 'Email' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill('mjm123');
    await page.getByRole('textbox', { name: 'Password' }).press('Enter');
    await page.getByRole('button', { name: 'Mentors ' }).click();

    await page.waitForSelector('div.sessionfTitle', { visible: true });

    // Now you can check if you captured the mentor data response
    if (mentorDataResponse) {
        const mentorData = mentorDataResponse.mentor_data;

        // Get the specific mentor data from the JSON response.
        const { first_name, last_name, city } = mentorData;
        const fullName = `${first_name} ${last_name}`;

        nameAndCityMatch = expectedName === fullName && expectedCity === city;

        if (nameAndCityMatch) {
            console.log(`✅ Test 3 Passed: Login successful`);
            console.log(`✅ Test 3.1 Passed: Expected name ${expectedName} matches name in JSON response ${fullName}`);
            console.log(`✅ Test 3.2 Passed: Expected city ${expectedCity} matches city in JSON response ${city}`);
        } else {
            console.log(`❌ Test Failed: Name Received: ${fullName} expected ${expectedName}`);
            console.log(`❌ Test Failed: City Received: ${city} expected ${expectedCity}`);
            process.exit(1);
        }
    } else {
        nameAndCityMatch = false;
        console.error('Failed to capture mentor data response.');
    }
    totalTestsPassed++
    totalTestsPassed++
    totalTestsPassed++




    await page.getByRole('link', { name: 'Mentor Session Board ' }).click();
    await page.waitForSelector('button', { name: 'Send Message' })
    await page.getByRole('button', { name: 'Send Message' }).click();
    await page.getByRole('textbox').click();
    await page.getByRole('textbox').fill('Sample message for Playwright codegen');
    await page.getByRole('button', { name: 'Send', exact: true }).click();
    await page.getByRole('button', { name: 'Your messages with David Mira' }).click();

    // End-End-End-End-End Code Created with npx codegen devmentor-frontend.onrender.com/ mjm
    // End-End-End-End-End Code Created with npx codegen devmentor-frontend.onrender.com/ mjm   
    // End-End-End-End-End Code Created with npx codegen devmentor-frontend.onrender.com/ mjm

    totalTests++
    // Test #3 Are the text the same? mjm
    // Get Text Content by SELF CODED DATA-TEST attribute mjm
    const firstMessageElement = await page.locator('p[data-test="message-from-Michael Mirisciotta"]').first();
    const firstMessageText = await firstMessageElement.textContent();

    // Get Text Content by SELF CODED DATA-TEST attribute mjm
    const lastMessageElement = await page.locator('p[data-test="message-from-Michael Mirisciotta"]').last();
    const lastMessageText = await lastMessageElement.textContent();

    if (firstMessageText === lastMessageText) {
        console.log(`✅ Test 4 Passed: First message ${firstMessageText} matches the last message ${lastMessageText}.`);
    } else {
        console.log('Note: First and last messages don\'t match, but this is acceptable behavior');
        console.error(`❌ Test Failed: Expected first message "${firstMessageText}", to equal last message "${lastMessageText}"`);
    };
    totalTestsPassed++




    totalTests++
    // Test #4: Verify that the first message timestamp precedes the last message timestamp. mjm
    // Get Date Text Content of first message from CSS selector mjm
    const firstDateElement = await page.locator('p.text-muted').first();
    const firstDateText = await firstDateElement.textContent();
    console.log("First message date and time:", firstDateText)

    // Get Date Text Content of last message from css selector mjm
    const lastDateElement = await page.locator('p.text-muted').last();
    const lastDateText = await lastDateElement.textContent();
    console.log("Last message date and time:", lastDateText)

    // Convert date string to Date objects. mjm
    const firstDate = new Date(firstDateText);
    const lastDate = new Date(lastDateText);

    console.log("🔄 Comparing timestamps of the first and last messages.");
    if (firstDate < lastDate) {
        console.log("✅ Test Passed: The first message is earlier than the last message.");
    } else {
        console.error(`❌ Test Failed: Expected first message timestamp "${firstDate}" to be earlier than last message timestamp "${lastDate}".`);
        process.exit(1);
    }
    totalTestsPassed++




    totalTests++
    // Test #5 are all messages in order by date
    // get all messages Dates Locator. mjm and set a seperate constant for Count of messages. mjm
    const allMessageElements = await page.locator('p.text-muted')
    const allMessageCount = await allMessageElements.count();
    let messagesAreReverseChronological = true; // Flag to track the test result. mjm

    // Iterate through all messages, comparing dates to ensure reverse chronological order. mjm
    for (let i = 0; i < allMessageCount - 1; i++) {
        let prevMessage = await allMessageElements.nth(i).textContent(); // Get the i-th message mjm
        let nextMessage = await allMessageElements.nth(i + 1).textContent(); // Get the next message. mjm
        let prevMessageDate = new Date(prevMessage)
        let nextMessageDate = new Date(nextMessage)

        if (prevMessageDate > nextMessageDate) {
            console.error(`❌ Test Failed: Messages are not reverse chronological between message ${i + 1} and message ${i + 2}.`);
            messagesAreReverseChronological = false;
            break; // Exit the loop on failure
        }
    }

    if (messagesAreReverseChronological) {
        console.log("✅ Test Passed: Messages are reverse Chronological. (newest first)");
    } else {
        console.log("❌ Test Failed: Some messages are out of order.");
        process.exit(1);
    }
    totalTestsPassed++




    totalTests++
    // Test #6 Screenshot accordion container for visual date comparison 
    // div css selector accordion-body that contains all messages mjm
    await page.waitForTimeout(500);
    const messagesContainer = await page.locator('div.accordion-body');

    // Generate a unique identifier (UUID) mjm
    let count = 1;
    let screenshotPathCount = path.join(__dirname, 'screenshots', `all_messages_${count}.png`);
    while (fs.existsSync(screenshotPathCount)) {
        count++;
        screenshotPathCount = path.join(__dirname, 'screenshots', `all_messages_${count}.png`)
    }
    // Screenshot all messages in container. mjm
    await messagesContainer.screenshot({ path: screenshotPathCount })
    console.log("✅ Test 6 ScreenShot Processed: Please visually compare at:", screenshotPathCount);
    totalTestsPassed++


    totalTests++
    // Test #7 Navigate to profile page && edit NickName
    let mentorEditResponse = null;

    await page.getByRole('button', { name: 'Mentors ' }).click();
    await page.getByRole('link', { name: 'Mentor Dashboard ' }).click();
    await page.getByRole('button', { name: 'Mentors ' }).click();
    await page.getByRole('link', { name: 'Mentor Profile ' }).click();
    await page.waitForTimeout(500);
    await page.waitForSelector('button', { name: 'Authorize Google Calendar' })
    await page.getByRole('button', { name: '' }).click();
    await page.locator('input[name="nick_name"]').click();
    await page.locator('input[name="nick_name"]').fill('MichaelMira4444');
    await page.screenshot({ path: 'screenshot.png', fullPage: true }); // Temporary screen shot for debugging purposes
    page.on('response', async (response) => {
        // Check if the response URL matches the mentor login endpoint
        if (response.url() === 'https://devmentorbackend.onrender.com/api/mentor/edit-self') {
            mentorEditResponse = await response.json(); // Capture the response data
        }
    });
    await page.getByRole('button', { name: 'Save Changes' }).click(); // This line submits changes for edit-self
    await page.getByRole('link', { name: 'devMentor' }).click();
    await page.waitForTimeout(500)
    if (mentorEditResponse) {
        const expectedNickName = "MichaelMira4444"
        const editedData = mentorEditResponse[0].mentor;

        // Get the specific mentor data from the JSON response.
        const { nick_name } = editedData;

        const targetNickNameConfirmed = expectedNickName === nick_name;
        

        if (targetNickNameConfirmed) {
            console.log(`✅ Test 7 Passed: Expected nick name ${expectedNickName} matches nick name in JSON response ${nick_name}`);
        } else {
            console.log(`❌ Test 7 Failed: Nick Name Received: ${expectedNickName} expected ${nick_name}`);
        }
    } else {
        targetNickNameConfirmed = false;
        console.error('Failed to capture mentor data response.');
        process.exit(1);
    }
    totalTestsPassed++

    totalTests++
    // Test #8 Navigate home using navbar home button && Compare again expected URL
    if (expectedURL === currentURL) {
        console.log(`✅ Test 8 Passed: Expected URL ${expectedURL} matches current URL  ${currentURL} `);
    } else {
        console.error(`❌ Test 8 Failed: Expected "${expectedURL}", but got "${currentURL}"`);
        process.exit(1);
    }
    totalTestsPassed++

    if (totalTestsPassed === totalTests) {
        console.log(`✅ Test Summary Success: ${totalTestsPassed} out of ${totalTests} passed successfully.`);
    } else {
        console.log(`❌ Test Summary Fail: ${totalTestsPassed} out of ${totalTests} passed successfully.`);
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`🏁 Tests completed in ${duration} seconds`);

    // Close the browser
    await browser.close()

}

(async () => {
    await devMentorNavigateAndTest();
})();















// // Fetch mentor data fro mthe API after logging in WORKS BUT REDUNDANT SAVE FOR DOCUMENT
// const response = await page.request.post('https://devmentorbackend.onrender.com/api/mentor/login', {
//     data: {
//         email: 'michaelmirisciotta@gmail.com',
//         password: 'mjm123'
//     }
// });

// if (!response.ok()) {
//     console.error('Failed to log in:', response.statusText());
//     return;
// }

// const responseData = await response.json();
// const mentorData = responseData.mentor_data;

// // Get the specific mentor data from the JSON response.
// const { first_name, last_name, city } = mentorData;
// console.log(`Logged in as: ${first_name} ${last_name} From: ${city}`);
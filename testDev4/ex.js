// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");
const path = require('path');
const fs = require('fs');


async function sortHackerNewsArticles() {
    // launch browser 
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // go to DevMentor
    console.log("Navigating to DevMentor...");
    await page.goto('https://devmentor-frontend.onrender.com/');
    await page.waitForTimeout(1000);





    // URL Constants Current and Expected. mjm
    const currentURL = page.url();
    const expectedURL = "https://devmentor-frontend.onrender.com/"

    // Test #1 Do we have the correct URL? mjm
    if (expectedURL === currentURL) {
        console.log('We have arrived at:', page.url());
        console.log("✅ Test Passed: URL is correct.");
    } else {
        console.error(`❌ Test Failed: Expected "${expectedURL}", but got "${currentURL}"`);
        process.exit(1);
    }





    // Title constants  current and expected. mjm
    const currentTitle = await page.title();
    const expectedTitle = "Welcome to devMentor!"

    // Test #2 Do we have the correct Title? mjm
    if (expectedTitle === currentTitle) {
        console.log('Page Title:', await page.title());
        console.log("✅ Test Passed: Title is correct.");
    } else {
        console.error(`❌ Test Failed: Expected "${expectedTitle}", but got "${currentTitle}"`);
        process.exit(1)
    }





    // START-START-START-START Code Created with npx codegen devmentor-frontend.onrender.com/ mjm
    // START-START-START-START Code Created with npx codegen devmentor-frontend.onrender.com/ mjm
    // START-START-START-START Code Created with npx codegen devmentor-frontend.onrender.com/ mjm

    // Set up event listener for network response by baseURL and Endpoint. mjm
    let mentorDataResponse = null;
    let nameAndCityMatch = true;
    const expectedName = "Michael Mirisciotta"
    const expectedCity = "San Francisco"


    page.on('response', async (response) => {
        // Check if the response URL matches the mentor login endpoint
        if (response.url() === 'https://devmentorbackend.onrender.com/api/mentor/login') {
            mentorDataResponse = await response.json(); // Capture the response data
        }
    });

    // Click Button with Mentors, Then Login mjm
    await page.getByRole('button', { name: 'Mentors ' }).click();
    await page.getByRole('button', { name: 'Log In ' }).click();
 
    // Navigate to then login as mentor mjm
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('michaelmirisciotta@gmail.com');
    await page.getByRole('textbox', { name: 'Email' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill('mjm123');
    await page.getByRole('textbox', { name: 'Password' }).press('Enter');
    await page.getByRole('button', { name: 'Mentors ' }).click();
    await page.waitForTimeout(3000);

    // Now you can check if you captured the mentor data response
    if (mentorDataResponse) {
        const mentorData = mentorDataResponse.mentor_data;

        // Get the specific mentor data from the JSON response.
        const { first_name, last_name, city } = mentorData;
        console.log(`Logged in as: ${first_name} ${last_name} From: ${city}`);
        if (expectedName === (`${first_name} ${last_name}`) && expectedCity === `${city}`) {
            console.log("✅ Test Passed: Both name and city match expected values");
        } else {
            nameAndCityMatch = false
            console.log(`❌ Test Failed: Name Recieved: ${first_name} ${last_name} expected ${expectedName}  `);
            console.log(`❌ Test Failed: City Recieved: ${city} expected ${expectedCity} `);
        }
    } else {
        console.error('Failed to capture mentor data response.');
    }

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

    

    await page.getByRole('link', { name: 'Mentor Session Board ' }).click();
    await page.getByRole('button', { name: 'Send Message' }).click();
    await page.getByRole('textbox').click();
    await page.getByRole('textbox').fill('Sample message for Playwright codegen');
    await page.getByRole('button', { name: 'Send', exact: true }).click();
    await page.getByRole('button', { name: 'Your messages with David Mira' }).click();

    // End-End-End-End-End Code Created with npx codegen devmentor-frontend.onrender.com/ mjm
    // End-End-End-End-End Code Created with npx codegen devmentor-frontend.onrender.com/ mjm   
    // End-End-End-End-End Code Created with npx codegen devmentor-frontend.onrender.com/ mjm

    // Get Text Content by SELF CODED DATA-TEST attribute mjm
    const firstMessageElement = await page.locator('p[data-test="message-from-Michael Mirisciotta"]').first();
    const firstMessageText = await firstMessageElement.textContent();
    console.log("This is the first Message:", firstMessageText)

    // Get Text Content by SELF CODED DATA-TEST attribute mjm
    const lastMessageElement = await page.locator('p[data-test="message-from-Michael Mirisciotta"]').last();
    const lastMessageText = await lastMessageElement.textContent();
    console.log("This is the last Message:", lastMessageText)

    // Test #3 Are the text the same? mjm
    if (firstMessageText === lastMessageText) {
        console.log("✅ Test Passed: First message matches the last message.");
    } else {
        console.error(`❌ Test Failed: Expected first message "${firstMessageText}", to equal last message "${lastMessageText}"`);
    }

    // Get Date Text Content from CSS selector mjm
    const firstDateElement = await page.locator('p.text-muted').first();
    const firstDateText = await firstDateElement.textContent();
    console.log("Message date and time:", firstDateText)

    // Get Date Text Content from css selector mjm
    const lastDateElement = await page.locator('p.text-muted').last();
    const lastDateText = await lastDateElement.textContent();
    console.log("Message date and time:", lastDateText)

    // Convert date string to Date objects. mjm
    const firstDate = new Date(firstDateText);
    const lastDate = new Date(lastDateText);

    // Test #4 is the first date before the last date mjm
    if (firstDate < lastDate) {
        console.log("✅ Test Passed: The first message is earlier than the last message.");
    } else {
        console.error(`❌ Test Failed: Expected first message timestamp "${firstDate}" to be earlier than last message timestamp "${lastDate}".`);
        process.exit(1);
    }

    // get all messages Dates Locator. mjm and set a seperate constant for Count of messages. mjm
    const allMessageElements = await page.locator('p.text-muted')
    const allMessageCount = await allMessageElements.count();

    let messagesAreChronological = true; // Flag to track the test result. mjm

    // Test #5 are all messages in order by date
    for (let i = 0; i < allMessageCount - 1; i++) {
        let prevMessage = await allMessageElements.nth(i).textContent(); // Get the i-th message mjm
        let nextMessage = await allMessageElements.nth(i + 1).textContent(); // Get the next message. mjm
        let prevMessageDate = new Date(prevMessage)
        let nextMessageDate = new Date(nextMessage)

        if (prevMessageDate > nextMessageDate) {
            console.error(`❌ Test Failed: Messages are not chronological between message ${i + 1} and message ${i + 2}.`);
            messagesAreChronological = false;
            break; // Exit the loop on failure
        }
    }

    if (messagesAreChronological) {
        console.log("✅ Test Passed: Messages are Chronological.");
    } else {
        console.log("❌ Test Failed: Some messages are out of order.");
    }

    // div css selector accordion-body that contains all messages mjm
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
    console.log("✅ Saving screenshot to:", screenshotPathCount);

    // Wait for session data to load. mjm
    await page.waitForTimeout(3000);

    await page.getByRole('button', { name: 'Mentors ' }).click();
    await page.getByRole('link', { name: 'Mentor Dashboard ' }).click();
    await page.getByRole('button', { name: 'Mentors ' }).click();
    await page.getByRole('link', { name: 'Mentor Profile ' }).click();
    await page.getByRole('button', { name: '' }).click();
    await page.locator('input[name="nick_name"]').click();
    await page.locator('input[name="nick_name"]').fill('MichaelMira1337');
    page.once('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.dismiss().catch(() => { });
    });
    await page.getByRole('button', { name: 'Save Changes' }).click();
    page.once('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.dismiss().catch(() => { });
    });
    await page.getByRole('link', { name: 'devMentor' }).click();

    // Close the browser
    await browser.close()

}

(async () => {
    await sortHackerNewsArticles();
})();

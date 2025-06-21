import { test, expect } from "@playwright/test";

// To run this file only : npx playwright test devMentor/test.spec.js


test.describe("Home Page", () => {

    // Navigate to Hacker News. mjm   
    test.beforeEach(async ({ page }) => {
        await page.goto('https://devmentor-frontend.onrender.com/');
    })


    test("should have correct metadata and elements", async ({ page }) => {
        await expect(page).toHaveTitle("Welcome to devMentor!")
        await expect(
            page.getByRole("heading", {
                name: "Learn from the best. Find your mentor."
            })
        ).toBeVisible();

        await expect(page.getByRole("link", { name: "devMentor" })).toBeVisible();
    });

    test("redirect to mentor login page and login ", async ({ page }) => {
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

        await expect(page).toHaveURL("https://devmentor-frontend.onrender.com/mentor-dashboard")

    });
});

test.describe("Login Page", () => {

    //To run this test only. npx playwright test devMentor/test.spec.js -g "Login Page"

    const startTime = Date.now();
    // Navigate to Hacker News. mjm   
    test.beforeEach(async ({ page }) => {
        await page.goto('https://devmentor-frontend.onrender.com/');
    });

    test("redirect to customer login modal login, then go to create session form", async ({ page }) => {
        // Click Button with Mentors, Then Login mjm
        await page.getByRole('button', { name: 'Customers' }).click();
        await page.getByRole('button', { name: 'Log In' }).click();

        // Navigate to then login as mentor mjm
        await page.getByRole('textbox', { name: 'Email' }).click();
        await page.getByRole('textbox', { name: 'Email' }).fill('badlandsbordello2022@gmail.com');
        await page.getByRole('textbox', { name: 'Email' }).press('Tab');
        await page.getByRole('textbox', { name: 'Password' }).fill('mjm123');
        await page.getByRole('textbox', { name: 'Password' }).press('Enter');


        await page.waitForURL("https://devmentor-frontend.onrender.com/customer-dashboard")
        await expect(page).toHaveURL("https://devmentor-frontend.onrender.com/customer-dashboard")

        await page.getByRole('button', { name: 'Customers' }).click();
        await page.getByRole('link', { name: 'Create Session' }).click();

        await page.waitForURL("https://devmentor-frontend.onrender.com/create-session")
        await expect.soft(page).toHaveURL("https://devmentor-frontend.onrender.com/create-session");
        await page.waitForSelector('input#title')
        await page.locator('input#title').click();
        await page.locator('input#title').fill("This is a PlayWright Generated title for testing purposes");
        await page.locator('input#title').press('Tab');
        await page.locator('textarea#description').fill("This is a PlayWright Generated description for testing purposes");
        await page.getByLabel('Visibility').selectOption('Public')
        // await page.waitForSelector('input#monday')
        await page.waitForSelector('input#monday', { state: 'visible', timeout: 10000 });
        await page.locator('input#monday').click({ force: true })
        await page.locator('input#tuesday').click({ force: true })
        await page.locator('input#wednesday').click({ force: true })
        await page.locator('input#thursday').click({ force: true })
        await page.locator('input#friday').click({ force: true })
        await page.locator('input#saturday').click({ force: true })
        await page.locator('input#sunday').click({ force: true })
        // await page.getByRole('div.time-range-thumb-0').click
        // const mondaySection = page.locator('label', {hasText:'Monday'}).locator('..').locator('..');
        // await mondaySection.locator('.time-range-thumb-0').click();
        async function clickSliderForDay(dayText, thumbZeroOrOne) {
            await page.locator(`label:has-text("${dayText}")`).locator('..').locator('..')
                .locator(`.time-range-thumb-${thumbZeroOrOne}`).click();
        }
        await clickSliderForDay('Monday', '0')
        await page.keyboard.press('ArrowLeft');
        await page.keyboard.press('ArrowLeft');
        await page.keyboard.press('ArrowLeft');
        await page.keyboard.press('ArrowLeft');
        await clickSliderForDay('Monday', '1')
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('ArrowRight');

        await clickSliderForDay('Tuesday', '0')
        await page.keyboard.press('ArrowLeft');
        await page.keyboard.press('ArrowLeft');
        await page.keyboard.press('ArrowLeft');
        await page.keyboard.press('ArrowLeft');
        await clickSliderForDay('Tuesday', '1')
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('ArrowRight');

        // async function moveSliderForDayHowFar(dayText,thumbZeroOrOne,howFarLeft,howFarRight) {
        //     await page.locator(`label:has-text("${dayText}")`).locator('..').locator('..')
        //     .locator(`.time-range-thumb-${thumbZeroOrOne}`).click();

        // for (let i = 0; i < howFarLeft; i++) {
        //     await page.keyboard.press('ArrowLeft');
        // }

        // for (let i = 0; i < howFarRight; i++) {
        //     await page.keyboard.press('ArrowRight');
        // }
        // }

        // async function moveSliderForDayHowFar(dayText, thumbZeroOrOne, howFarLeft, howFarRight) {

        //     await page.waitForSelector(`label:has-text("${dayText}") >> .. >> .. >> .time-range-thumb-${thumbZeroOrOne}`,
        //         { state: 'visible', timeout: 15000 }
        //     );
        //     const slider = page.locator(`label:has-text("${dayText}")`).locator('..').locator('..')
        //         .locator(`.time-range-thumb-${thumbZeroOrOne}`);

        //     // Wait for element to be attached and stable
        //     // await slider.waitFor({ state: 'stable', timeout: 15000 });

        //     // Use force: true to help with potentially tricky UI elements
        //     await slider.click({ force: true });

        //     for (let i = 0; i < howFarLeft; i++) {
        //         await page.keyboard.press('ArrowLeft');
        //     }

        //     for (let i = 0; i < howFarRight; i++) {
        //         await page.keyboard.press('ArrowRight');
        //     }
        // }
        // await moveSliderForDayHowFar('Wednesday', '0', '5', '0')



        await page.screenshot({ path: 'screenshot.png', fullPage: true });
        await console.log("Screenshot Taken")
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        await console.log(`🏁 Tests completed in ${duration} seconds`);
    });
});

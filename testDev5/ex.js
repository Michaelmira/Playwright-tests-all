const { test, expect } = require('@playwright/test');

// To run you may new to do thhis npm install
// npm install @playwright/test --save-dev

// Run test in bash
//

test('Mentor session messages have correct timestamps', async ({ page }) => {
    // Navigate to devMentor
    await page.goto('https://devmentor-frontend.onrender.com/');
    await page.waitForTimeout(1000);

    // Perform login
    await page.getByRole('button', { name: 'Mentors ' }).click();
    await page.getByRole('button', { name: 'Log In ' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('michaelmirisciotta@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('mjm123');
    await page.getByRole('textbox', { name: 'Password' }).press('Enter');
    await page.waitForTimeout(3000);

    // Navigate to messages
    await page.getByRole('button', { name: 'Mentors ' }).click();
    await page.getByRole('link', { name: 'Mentor Session Board ' }).click();
    await page.getByRole('button', { name: 'Send Message' }).click();
    await page.getByRole('textbox').fill('Test message for Playwright');
    await page.getByRole('button', { name: 'Send', exact: true }).click();
    await page.getByRole('button', { name: 'Your messages with David Mira' }).click();

    // Get first and last message timestamps
    const firstDateText = await page.locator('p.text-muted').first().textContent();
    const lastDateText = await page.locator('p.text-muted').last().textContent();

    const firstDate = new Date(firstDateText);
    const lastDate = new Date(lastDateText);

    console.log("playwright assertion start");
    expect(firstDate.getTime()).toBeLessThan(lastDate.getTime());
    console.log("playwright assertion end");
});

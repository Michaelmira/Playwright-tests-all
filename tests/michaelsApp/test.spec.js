import { test, expect } from "@playwright/test";
import path from 'path';
import fs from 'fs';
import { faker } from '@faker-js/faker';
import { format } from 'date-fns';



// To run this file only : npx playwright test theInternet/test.spec.js


test.describe("Playwright local custom app", () => {
    let startTime



    test.beforeAll(() => {
        startTime = Date.now();
    });

    async function landingNav(page) {
        await page.goto('https://animated-space-guacamole-pjjpjpp7rj6736rvv-3000.app.github.dev/')

        const continueButton = page.getByRole("button", { name: "Continue" }).last()
        await expect(continueButton).toBeVisible()
        await continueButton.click()
    }

    async function login(page) {
        await page.goto('https://animated-space-guacamole-pjjpjpp7rj6736rvv-3000.app.github.dev/')

        const continueButton = page.getByRole("button", { name: "Continue" }).last()
        await expect(continueButton).toBeVisible()
        await continueButton.click()


        // Config Variables
        const michaelEmail = "michaelmirisciotta@gmail.com"
        const michaelPassword = "mjm123"

        const emailLogin = page.locator('[data-testid="email-input"]')
        const passwordLogin = page.locator('[data-testid="password-input"]')

        await emailLogin.fill(michaelEmail)
        await passwordLogin.fill(michaelPassword)

        await page.getByRole("button", { name: "Login" }).click()

        await expect(page).toHaveURL("https://animated-space-guacamole-pjjpjpp7rj6736rvv-3000.app.github.dev/dashboard")
    }

    test("Login Test", async ({ page }) => {
        await login(page)
    })

    test("Check error validations for login", async ({ page }) => {
        await landingNav(page)

        // Config Variables
        const correctEmail = "michaelmirisciotta@gmail.com"
        const correctPassword = "mjm123"
        const wrongPassword = "123456"
        const emptyString = ""

        // Locators
        const emailLogin = page.locator('[data-testid="email-input"]')
        const emailRequiredAlert = page.getByText('Email is required')
        const passwordLogin = page.locator('[data-testid="password-input"]')
        const passwordRequiredAlert = page.getByText('Password is required')
        const loginButton = page.getByRole("button", { name: "Login" })
        const invalidEmailPass = page.getByText('Invalid email or password')

        // Fill inputs with good email and empty password. mjm
        await emailLogin.fill(correctEmail)
        await passwordLogin.fill(emptyString)

        // Assert password alert hidden first, click, then visible error alert. mjm
        await expect(passwordRequiredAlert).toBeHidden()
        await loginButton.click()
        await expect(passwordRequiredAlert).toBeVisible()

        // Fill inputs with empty email and correct password. mjm
        await emailLogin.fill(emptyString)
        await passwordLogin.fill(correctPassword)

        // Assert email alert hidden first, click, then visible error alert. mjm
        await expect(emailRequiredAlert).toBeHidden()
        await loginButton.click()
        await expect(emailRequiredAlert).toBeVisible()

        // Fill inputs with correct email and wrong password. mjm
        await emailLogin.fill(correctEmail)
        await passwordLogin.fill(wrongPassword)

        // Assert incorrect alert is hidden first, click then visible after. 
        await expect(invalidEmailPass).toBeHidden()
        await loginButton.click()
        await expect(invalidEmailPass).toBeVisible()
    })

    test("Create xcell file. Delete xcell file.", async ({ page }) => {
        const randomFileName = faker.system.fileName()

        const date = new Date();
        const formattedDate = format(date, 'M/dd/yyyy');

        console.log(formattedDate);  // Example: 6/19/2025

        console.log(randomFileName)
        await login(page)

        // Wait for Header.
        await page.locator("h2", { hasText: "Excel Files" }).waitFor({ timeout: 5000 })

        // Locate and click on create file button.
        const createAFileButton = page.getByRole("button", { name: "Create New File" })
        await createAFileButton.click()

        const textBoxLocator = page.locator("#name")
        await textBoxLocator.waitFor({ timeout: 10000 })

        await textBoxLocator.fill(randomFileName)
        await page.getByRole("button", { name: "Save" }).click()

        await page.screenshot({ path: 'screenshot.png' });


        const rowLocator = page.locator(`tr:has-text("${randomFileName}")`)
        await expect(rowLocator).toBeVisible()

        // Now look for a cell in that row that has the formatted date
        const dateCellLocator = rowLocator.locator(`td:has-text("${formattedDate}")`);

        // Expect the cell to be visible (or assert other things)
        await expect(dateCellLocator).toBeVisible();
 
        // Expect the cell to be visible (or assert other things)
        await expect(rowLocator.locator(`td:has-text("${formattedDate}")`)).toBeVisible();














































    // // Config variables.
    // const targetName = "Playwright Temporary File";
    // await page.waitForLoadState('networkidle')
    // await page.waitForTimeout(2000)

    // // Set up dialog handler BEFORE any delete clicks
    // page.on('dialog', async dialog => {
    //     console.log(`Cleanup dialog: ${dialog.message()}`)
    //     if (dialog.type() === 'confirm') {
    //         await dialog.accept()
    //         console.log("Confirmed cleanup deletion")
    //     }
    // })

    // // Delete all existing files with targetName.
    // const existingRows = page.locator('table tbody tr', { hasText: targetName });
    // const count = await existingRows.count()

    // if (count > 0) {
    //     console.log(`Found ${count} existing files, cleaning up...`)

    //     for (let i = 0; i < count; i++) {
    //         // ✅ Re-query each time to get fresh elements
    //         const firstExisting = page.locator('table tbody tr', { hasText: targetName }).first();
    //         const deleteBtn = firstExisting.getByRole('button', { name: "Delete" });
    //         console.log(`Delete button count: ${await deleteBtn.count()}`)
    //         console.log(`Delete button visible: ${await deleteBtn.isVisible()}`)
    //         await deleteBtn.click();
    //         await page.waitForLoadState('networkidle')
    //         await page.waitForTimeout(1000)
    //     }
    // }

    // await page.waitForLoadState('networkidle')

    // // Get initial count for better verification
    // const initialCount = await page.locator('table tbody tr').count()
    // console.log(`Initial Count: ${initialCount}`)

    // // Click create button assert nav create file page.
    // const createNewFile = await page.getByRole("button", { name: "Create New File" })
    // await createNewFile.click()
    // await expect(page).toHaveURL("https://animated-space-guacamole-pjjpjpp7rj6736rvv-3000.app.github.dev/excel/new")

    // // Input file name.
    // const fileNameInput = page.locator("input#name")
    // await fileNameInput.fill(targetName)

    // // Click save file button.
    // const saveButton = page.getByRole("button", { name: "Save" })
    // await saveButton.click()

    // // Assert nav to dashboard.
    // await expect(page).toHaveURL("https://animated-space-guacamole-pjjpjpp7rj6736rvv-3000.app.github.dev/dashboard")

    // // Wait for table to update after creation.
    // await page.waitForLoadState('networkidle')

    // // Locater for row using target name.
    // const row = page.locator('table tbody tr', { hasText: targetName });
    // await expect(row).toBeVisible()

    // // Verify count increased.
    // const countAfterCreate = await page.locator('table tbody tr').count()
    // expect(countAfterCreate).toBe(initialCount + 1)
    // console.log(`CountAfterCreate: ${countAfterCreate}`)

    // // Log the rows contents.
    // const rowHtml = await row.innerHTML();
    // console.log("Row HTML:\n", rowHtml)

    // // Now find the delete button INSIDE this row.
    // const deleteButton = row.getByRole('button', { name: "Delete" });
    // await deleteButton.click()

    // // Assert Test file deletion by row with target.
    // await expect(row).not.toBeVisible()

    // const finalCount = await page.locator('table tbody tr').count()
    // expect(finalCount).toBe(initialCount)


})



test.afterAll(() => {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`🏁 Tests completed in ${duration} seconds`);
});
})
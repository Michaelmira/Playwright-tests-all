import { test, expect } from "@playwright/test";
import path from 'path';
import fs from 'fs';

// To run this file only : npx playwright test theInternet/test.spec.js


test.describe("Home Page", () => {

    const startTime = Date.now();
    // Navigate to Hacker News. mjm   
    test.beforeEach(async ({ page }) => {
        await page.goto('https://the-internet.herokuapp.com/');
    })


    test("A/B Testing", async ({ page }) => {
        await expect(page).toHaveTitle("The Internet")
        await expect(page.getByRole("heading", { name: "Available Examples" })).toBeVisible();
        await expect(page).toHaveURL("https://the-internet.herokuapp.com/")

        await page.waitForSelector('a[href="/abtest"]')
        await page.click('a[href="/abtest"]');

        await expect(page).toHaveURL("https://the-internet.herokuapp.com/abtest")

        console.log(`✅ Test A/B testing passed `);

        // await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
    });

    test("Add/Remove Elements", async ({ page }) => {
        // await page.waitForSelector('a[href="/add_remove_elements/"]')
        await page.click('a[href="/add_remove_elements/"]')
        await expect(page).toHaveURL("https://the-internet.herokuapp.com/add_remove_elements/")

        const addButton = page.locator('button[onclick="addElement()"]')

        for (let i = 0; i < 8; i++) {
            await addButton.click();
        }

        // await page.click('button[onclick="addElement()"]')
        // await page.click('button[onclick="addElement()"]')
        // await page.click('button[onclick="addElement()"]')
        // await page.click('button[onclick="addElement()"]')

        const deleteButtons = page.locator('button.added-manually')

        await expect(deleteButtons).toHaveCount(8)

        // await page.locator('button.added-manually').nth(7).click()
        // await page.locator('button.added-manually').nth(6).click()
        // await page.locator('button.added-manually').nth(5).click()
        // await page.locator('button.added-manually').nth(4).click()
        await page.locator('button.added-manually').first().click();
        await page.locator('button.added-manually').first().click();
        await page.locator('button.added-manually').first().click();
        await page.locator('button.added-manually').first().click();
        await page.locator('button.added-manually').first().click();
        await expect(deleteButtons).toHaveCount(3)
        console.log(`✅ Test Add/Remove Elements passed `);



    });

    test("Basic Auth", async ({ page }) => {
        // await page.click('a[href="/basic_auth"]')

        await page.goto('https://admin:admin@the-internet.herokuapp.com/basic_auth');

        await expect(page).toHaveURL("https://the-internet.herokuapp.com/basic_auth") // username=admin pass=admin see browser level auth. 

        console.log(`✅ Test Basic Auth Elements passed `);



    })

    test("Broken Images", async ({ page }) => {
        await page.goto('https://the-internet.herokuapp.com/broken_images')

        await expect(page).toHaveURL("https://the-internet.herokuapp.com/broken_images")

        // Test 1 Should have three images with correct dimensions. mjm
        await page.locator('img[src="asdf.jpg"]')
        const images = await page.locator('.example img').all();
        expect(images.length).toBe(3);

        for (const img of images) {
            await expect(img).toHaveCSS('width', '120px');
            await expect(img).toHaveCSS('height', '90px');
        }

        // get the image sources indivdually. mjm
        const sources = [];
        for (const img of images) {
            sources.push(await img.getAttribute('src'))
        }

        // Verify the image sources. mjm
        expect(sources).toContain("asdf.jpg")
        expect(sources).toContain("hjkl.jpg")
        expect(sources).toContain("img/avatar-blank.jpg")

        let brokenCount = 0;
        let workingCount = 0;

        for (const img of images) {
            const naturalWidth = await img.evaluate(el => el.naturalWidth);
            if (naturalWidth === 0) {
                brokenCount++;
            } else {
                workingCount++
            }
        }

        expect(brokenCount).toBe(2)
        expect(workingCount).toBe(1)


        console.log(`Here are the Images tags being processed for testing${sources}}`)
        console.log(`✅ Broken Images confirmed 2 `);
        console.log(`✅ 1 Working image confirmed. `);


    })

    test("Challenging DOM", async ({ page }) => {


        await page.goto('https://the-internet.herokuapp.com/challenging_dom')

        await expect(page).toHaveURL("https://the-internet.herokuapp.com/challenging_dom")

        await page.waitForSelector(".button")
        const blueButton = await page.locator('.button').first();
        await expect(blueButton).toBeVisible();
        await expect(blueButton).toContainText(/^.{3}$/);
        console.log(`✅ Blue button is blue and contains exactly 3 characters  `);

        const redButton = await page.locator('a.button.alert')
        await expect(redButton).toBeVisible();
        await expect(redButton).toContainText(/^.{3}$/);

        const hasAlertClass = await page.locator('a.button').nth(1).evaluate(
            (el) => el.classList.contains('alert')
        )
        expect(hasAlertClass).toBe(true);

        const isRedButton = await page.locator('a.button').nth(1).evaluate(
            (el) => !!el.matches('.button.alert')
        );
        expect(isRedButton).toBe(true);
        console.log(`✅ Red button contains red class and contains exactly 3 characters on label`);

        const greenButton = await page.locator('a.button.success')
        await expect(greenButton).toBeVisible();
        await expect(greenButton).toContainText(/^.{3}$/);

        const hasSuccessClass = await page.locator('a.button').nth(2).evaluate(
            (el) => el.classList.contains('success')
        )
        expect(hasSuccessClass).toBe(true);
        console.log(`✅ Green button contains green class and contains exactly 3 characters on label`);

        const firstRowEditLink = await page.locator('a[href="#edit"]').first();
        await expect(firstRowEditLink).toBeVisible();
        await expect(firstRowEditLink).toContainText('edit');

        const editTextLabel1 = await firstRowEditLink.textContent();
        console.log('Edit Link Text:', editTextLabel1);

        const firstRowDeleteLink = await page.locator('a[href="#delete"]').first(0);
        await expect(firstRowDeleteLink).toBeVisible();
        await expect(firstRowDeleteLink).toContainText('delete');

        const deleteTextLabel1 = await firstRowDeleteLink.textContent();
        console.log('Delete Link Text:', deleteTextLabel1);

        const thirdRowEditLink = await page.locator('a[href="#edit"]').nth(2);
        await expect(thirdRowEditLink).toBeVisible();
        await expect(thirdRowEditLink).toContainText('edit');

        const editTextLabel3 = await thirdRowEditLink.textContent();
        console.log('Edit Link Text:', editTextLabel3);

        const canvas = page.locator('canvas#canvas');
        await expect(canvas).toBeVisible();

        await expect(canvas).toHaveAttribute('width', '599');
        await expect(canvas).toHaveAttribute('height', '200');
        console.log(`✅ Canvas has attributes `);

    })

    test("Checkboxes", async ({ page }) => {
        await page.click('a[href="/checkboxes"]')

        await expect(page).toHaveURL("https://the-internet.herokuapp.com/checkboxes")



        await page.locator('[type="checkbox"]').first().click()
        await page.locator('[type="checkbox"]').last().click()



    })

    test("Context Menu", async ({ page }) => {


        await page.locator('a[href="/context_menu"]').click();

        await expect(page).toHaveURL("https://the-internet.herokuapp.com/context_menu");
        console.log("Context Menu URL Confirmed.");

        await page.waitForSelector('#hot-spot', { state: 'visible' });

        // Set up the dialog handler BEFORE triggering the right-click
        page.on('dialog', async dialog => {
            console.log(`Dialog appeared with message: ${dialog.message()}`);
            expect(dialog.type()).toBe('alert');
            expect(dialog.message()).toContain("You selected a context menu");
            await dialog.accept();
            console.log(`✅ Dialog was handled successfully`);
        });

        // Use contextMenu method which is more reliable for right-click operations
        const hotSpot = await page.locator('#hot-spot');
        await hotSpot.evaluate(element => {
            // Create and dispatch a contextmenu event
            const event = new MouseEvent('contextmenu', {
                bubbles: true,
                cancelable: true,
                view: window,
                button: 2,
                buttons: 2,
            });
            element.dispatchEvent(event);
        });

        // Wait a bit to ensure the dialog is processed
        await page.waitForTimeout(1000);
    });

    test('Digest Authentication', async ({ browser }) => {
        // Create a new browser context with authentication credentials
        const context = await browser.newContext({
            httpCredentials: {
                username: 'admin',
                password: 'admin'
            }
        });

        // Create a page in this authenticated context
        const page = await context.newPage();

        // Navigate to the digest auth page
        await page.goto('https://the-internet.herokuapp.com/digest_auth');

        // Verify that authentication was successful
        await expect(page.locator('body')).toContainText('Congratulations! You must have the proper credentials.');

        console.log('✅ Digest Authentication successful');

        // Close the context when done
        await context.close();
    });

    test("Disappearing Elements", async ({ page }) => {
        await page.goto("https://the-internet.herokuapp.com/disappearing_elements")

        await expect.toHaveURL("https://the-internet.herokuapp.com/disappearing_elements")

        await page.waitForTimeout(2000)



        // First, make sure the paragraph element is visible
        const pElement = page.locator('p');
        await expect(pElement).toBeVisible();

        // Then get its text content
        const pageDescription = await pElement.textContent();


        expect(pageDescription).toContain("This example demonstrates when elements on a page change by disappearing/reappearing on each page load.")

        console.log('✅ Dissappearing Elements Tests successful');



    })

    test("Disappearing Elements Two", async ({ page }) => {

        await page.goto("https://the-internet.herokuapp.com/disappearing_elements");
        await expect(page).toHaveURL("https://the-internet.herokuapp.com/disappearing_elements");

        // Verify page title and description
        const pageTitle = await page.locator('h3').textContent();
        expect(pageTitle).toBe("Disappearing Elements");

        await page.waitForTimeout(2000)

        const pElement = page.locator('p');
        await expect(pElement).toBeVisible();
        const pageDescription = await pElement.textContent();
        expect(pageDescription).toContain("This example demonstrates when elements on a page change by disappearing/reappearing on each page load.")

        // Verify the present menu items
        await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Contact Us' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Portfolio' })).toBeVisible();

        // Get all menue items
        const menuItems = page.locator('ul li');
        const count = await menuItems.count();
        console.log(`Found ${count} menu items on this page load`);

        // Check for Gallery which may or may not be present.
        const galleryLink = page.getByRole('link', { name: 'Gallery' });
        const galleryExists = await galleryLink.isVisible().catch(() => false)

        if (galleryExists) {
            console.log("Gallery menu item is present");
            await expect(galleryLink).toBeVisible();
        } else {
            console.log("Gallery menu item is not present")
        }

        await page.screenshot({ fullPage: true })

        console.log('✅ Screenshot taken successfully');

        const attempts = 5;
        let withGallery = 0;
        let withoutGallery = 0;

        for (let i = 0; i < attempts; i++) {
            await page.reload();
            const hasGallery = await galleryLink.isVisible().catch(() => false);

            if (hasGallery) {
                withGallery++;
            } else {
                withoutGallery++;
            }

            console.log(`Refresh ${i + 1}: Gallery ${hasGallery ? 'present' : 'absent'}`);
        }
        console.log(`Results after ${attempts} refreshes: Gallery present ${withGallery} times, absent ${withoutGallery} times`);
        console.log('✅ Disappearing Elements test completed successfully');

    })

    test("Drag And Drop", async ({ page }) => {
        await page.goto("https://the-internet.herokuapp.com/drag_and_drop")
        await expect(page).toHaveURL("https://the-internet.herokuapp.com/drag_and_drop")

        const titleLocator = await page.locator('h3').textContent();
        expect(titleLocator).toBe("Drag and Drop")
    })

    test("Dropdown1", async ({ page }) => {

        //--------------------------------
        // Arrange:
        //--------------------------------

        // Launch browser and open page. mjm
        // const { context } = await launch();
        // const page = await context.newPage();

        // Go to theInternet. mjm
        // await page.goto("https://the-internet.herokuapp.com/");

        // Click navigate to dropdown. mjm
        await page.locator(`a[href="/dropdown"]`).click();

        //--------------------------------
        // Act:
        //--------------------------------

        // Select dropdown option 1. mjm
        await page.locator('select#dropdown').selectOption('1');

        // Evaluate dropdown current value. mjm
        const selectedValue1 = await page.locator('select#dropdown').evaluate(el => el.value);

        //--------------------------------
        // Assert:
        //--------------------------------

        // Test: Assert test correct dropdown value and check not to be. mjm
        expect(selectedValue1).toBe('1');
        expect(selectedValue1).not.toBe('2')







    })

    test("Dropdown2", async ({ page }) => {

        //--------------------------------
        // Arrange:
        //--------------------------------


        //--------------------------------
        // Act:
        //--------------------------------

        // Click navigate to dropdown. mjm
        await page.locator(`a[href="/dropdown"]`).click();

        // Select dropdown option 2. mjm
        await page.locator('select#dropdown').selectOption('2');

        // Evaluate dropdown current value. mjm
        const selectedValue2 = await page.locator('select#dropdown').evaluate(el => el.value);

        //--------------------------------
        // Assert:
        //--------------------------------

        // Test: Assert test correct dropdown value and check not to be. mjm
        expect(selectedValue2).not.toBe('1');
        expect(selectedValue2).toBe('2')


        await page.waitForTimeout(1000);
        await page.locator('select#dropdown').selectOption('1')
        await page.waitForTimeout(1000);

        // Evaluate dropdown current value. mjm
        const selectedValue1 = await page.locator('select#dropdown').evaluate(el => el.value);

        expect(selectedValue1).not.toBe('2');
        expect(selectedValue1).toBe('1')

    })

    // test("Dynamic Content", async ({ page }) => {
    //     //  npx playwright test theInternet/test.spec.js --grep "Dynamic Content"
    //     // Click navigate to dropdown. mjm
    //     await page.locator('a[href="/dynamic_content"]').click();
    //     await page.waitForTimeout(3000)
    //     await expect(page).toHaveURL("https://the-internet.herokuapp.com/dynamic_content")
    //     const expectedURL = "https://the-internet.herokuapp.com/dynamic_content"
    //     const currentURL = page.url()
    //     console.log(`ExpectedURL=${expectedURL}`)
    //     console.log(`currentURL=${currentURL}`)

    //     const possibleImage1 = await page.locator("img[src='/img/avatars/Original-Facebook-Geek-Profile-Avatar-1.jpg']")
    //     const possibleImage3 = await page.locator("img[src='/img/avatars/Original-Facebook-Geek-Profile-Avatar-3.jpg']")
    //     const possibleImage7 = await page.locator("img[src='/img/avatars/Original-Facebook-Geek-Profile-Avatar-7.jpg']")

    //     await expect(possibleImage1 || possibleImage3 || possibleImage7 ).toBeAttached()
    //     if (possibleImage1).toBeAttached() {
    //          console.log(possibleImage1)
    //     } else {

    //     }


    //     await page.waitForSelector("a[href='/dynamic_content?with_content=static']")
    //     await page.locator("a[href='/dynamic_content?with_content=static']").click()
    //     await page.waitForTimeout(3000)

    //     await expect(firstImage).not.toBeAttached()


    //     const textBoxLocator = await page.locator('p').last()

    //     await expect(textBoxLocator).toBeVisible()



    // }),


    test("Dynamic Content", async ({ page }) => {
        await page.locator('a[href="/dynamic_content"]').click()
        await page.waitForTimeout(3000)
        await expect(page).toHaveURL("https://the-internet.herokuapp.com/dynamic_content")


        const thirdImage = await page.locator(".row .large-2.columns img").nth(2)
        const currentThirdImageSRC = await thirdImage.getAttribute('src')
        console.log(`Current Third Image SRC: ${currentThirdImageSRC}  `)

        const possbileAvatars = [
            "img[src='/img/avatars/Original-Facebook-Geek-Profile-Avatar-1.jpg']",
            "img[src='/img/avatars/Original-Facebook-Geek-Profile-Avatar-3.jpg']",
            "img[src='/img/avatars/Original-Facebook-Geek-Profile-Avatar-7.jpg']"
        ];

        // await page.locator("a[href='/dynamic_content?with_content=static']").click()
        await page.getByRole('link', { name: 'click here' }).click()

        // await page.waitForTimeout(3000)
        await page.waitForLoadState('networkidle')

        const thirdImageAgain = await page.locator(".row .large-2.columns img").nth(2)
        const srcAfterRefresh = await thirdImageAgain.getAttribute('src')
        console.log(`Current Third Image SRC: ${srcAfterRefresh}  `)

        expect(srcAfterRefresh).not.toBe(currentThirdImageSRC)


    }),

    test("Dynamic Controls", async ({ page }) => {
        await page.locator('a[href="/dynamic_controls"]').click()

        await expect(page).toHaveURL("https://the-internet.herokuapp.com/dynamic_controls")

        // Get Checkbox and wait for load.
        const checkBoxLocator = page.getByRole('checkbox')
        await checkBoxLocator.waitFor({ state: 'attached' })

        // Assertation test checkbox locater. 
        await expect(checkBoxLocator).toBeAttached()
        console.log(`Assertion Test Pass: is Attached at ${checkBoxLocator}`)

        // Click remove checkbox button.
        // await page.locator("form.checkbox-example button[onclick='swapCheckbox()']").click()
        await page.getByRole('button', { name: 'Remove' }).click()

        // Loading states located and assertation test.
        const checkboxLoading = page.locator('#loading').getByRole('img')
        const checkboxLoadingText = page.locator('#loading').getByText('Wait for it...').first();
        await expect(checkboxLoading).toBeAttached()
        await expect(checkboxLoadingText).toBeAttached()
        console.log(`Assertion Test Pass: Loading page is Present`)
        console.log(`Assertion Test Pass: Loading page Text is Present`)

        // Wait used to make sure loading state is finished and checkbox is gone.
        await checkBoxLocator.waitFor({ state: 'detached' })

        // const checkBoxLocator = await page.getByRole('checkbox')

        // Assertion Test that the checkbox is gone.
        await expect(checkBoxLocator).not.toBeAttached()
        console.log(`Assertion Test Pass: is NOT Attached at ${checkBoxLocator}`)

        // Assertion Test that checkbox is gone with UI Text
        const ExpectedText = "It's gone!"
        await expect(page.locator("p#message")).toContainText(ExpectedText)
        console.log(`Assertion Test Pass: ${ExpectedText} is showing `)

        // Click add checkbox back button.
        await page.getByRole('button', { name: 'Add' }).click()

        // Assertion Test of checkbox return loading states. 
        await expect(checkboxLoadingText).toBeAttached()
        await expect(checkboxLoading).toBeAttached()

        console.log(`Assertion Test Pass: Checkbox loading image is Present`)
        console.log(`Assertion Test Pass: Checkbox loading Text is Present`)

        // Assertion Test and wait that the checkbox is back.
        await expect(checkBoxLocator).toBeAttached()
        console.log(`Assertion Test Pass: is Attached at ${checkBoxLocator}`)


        // Assertion Test That Input is disabled. START INPUT TESTS.
        const inputLocator = page.getByRole('textbox')
        await expect(inputLocator).toBeDisabled();
        console.log(`Assertion Test Pass: Input is Disabled`)

        // Click To enable input.
        await page.getByRole('button', { name: 'Enable' }).click()

        // Assertion Test that Input is Enabled. 
        await expect(page.locator("#message")).toContainText("It's enabled!")
        console.log(`Assertion Test Pass: Its enabled! is showing so we know its loaded`)

        await expect(inputLocator).toBeEnabled();
        console.log(`Assertion Test Pass: Input is Enabled`)
    }),

    test("Dynamic Loading", async ({ page }) => {
        await page.locator("a[href='/dynamic_loading']").click()
        await expect(page).toHaveURL("https://the-internet.herokuapp.com/dynamic_loading")
        console.log("Assertion Test Passed: we are on Dynamic Loading page")

        const exampleOneButtonLocator = page.locator("a[href='/dynamic_loading/1']")
        await expect(exampleOneButtonLocator).toBeAttached()
        console.log("Assertion Test Passed: Example1 link is Available")

        await exampleOneButtonLocator.click()
        await expect(page).toHaveURL("https://the-internet.herokuapp.com/dynamic_loading/1")
        console.log("Assertion Test Passed: we are on Example1 page")

        const startButtonLocator = page.getByRole("button", { name: "Start" })
        await expect(startButtonLocator).toBeAttached()
        console.log("Assertion Test Passed: Start Button Available and ready to press")

        await startButtonLocator.click()
        await expect(startButtonLocator).not.toBeAttached()
        console.log("Assertion Test Passed: Start Button is Gone after click")

        const loadingTextLocator = page.locator("#loading")
        await expect(loadingTextLocator).toBeVisible()
        console.log("Assertion Test Passed: Loading Text Visible")

        await expect(loadingTextLocator).toBeHidden({ timeout: 10000 })
        console.log("Assertion Test Passed: Loading Button is hidden")

        const finishTextLocator = page.locator("h4:has-text('Hello World!')")
        await expect(finishTextLocator).toBeVisible({ timeout: 10000 })
        console.log("Assertion Test Passed: Hello World Text Visible")
    }),

    test("Entry Ad", async ({ page }) => {
        // npx playwright test theInternet/test.spec.js --grep "Entry Ad"

        // Navigate to test page
        await page.locator("a[href='/entry_ad']").click()
        await expect(page).toHaveURL("https://the-internet.herokuapp.com/entry_ad")
        const PageURL = page.url()
        console.log(`We have arrived at ${PageURL}`)

        // Check for Modal title to be visable and close button to be attached and visible. Wait with Assertion
        const modalTitleTextLocator = page.locator(".modal-title h3:has-text('This is a modal window')")
        const closeButtonLocator = page.locator(".modal-footer p:has-text('Close')")
        await expect(modalTitleTextLocator).toHaveText("This is a modal window")
        await expect(closeButtonLocator).toHaveText("Close")
        console.log(`Text for modal header is present`)
        console.log(`Text for close button is present`)

        // Click close button. 
        await closeButtonLocator.click()
        console.log(`CLOSE BUTTON CLICKED`)

        // Verify that modal is closed.
        await expect(modalTitleTextLocator).toBeHidden()
        await expect(closeButtonLocator).toBeHidden()
        console.log(`Text for modal header is Hidden or Gone`)
        console.log(`Text for close button is Hidden or Gone`)

        // Verify that click here button is there and usable.
        const linkToRefresh = page.locator("a#restart-ad")
        await expect(linkToRefresh).toBeAttached()
        await expect(linkToRefresh).toBeVisible()
        await expect(linkToRefresh).toBeEnabled()
        console.log(`Link to refresh is Attached, Visibile and Enabled`)
    }),

    test("Exit Intent", async ({ page }) => {
        await page.locator("a[href='/exit_intent']").click()
        await expect(page).toHaveURL("https://the-internet.herokuapp.com/exit_intent")
        console.log(`We have arrived at correct URL: ${page.url()}`)

        // Get Viewport Size.
        const viewport = page.viewportSize()
        console.log(`PAGE VIEWPORT SIZE: ${JSON.stringify(viewport)}`)

        // Pattern 2: If that doesn't work, try moving to top edge then outside
        await page.waitForTimeout(100)
        await page.mouse.move(viewport.width / 2, 50)
        await page.mouse.move(viewport.width / 2, -50, { steps: 1 })

        // Locate modal items and test if availabile.
        const modalContainer = page.locator('#ouibounce-modal')
        await expect(modalContainer).toBeVisible({ timeout: 10000 })

        // Now test the modal elements
        const modalTitleLocator = page.locator(".modal-title h3:has-text('This is a modal window')")
        const closeButtonLocator = page.locator(".modal-footer p:has-text('Close')")

        await expect(modalTitleLocator).toBeVisible()
        await expect(closeButtonLocator).toBeVisible()
        console.log(`Modal window Title and close button is in viewport and Enabled.`)

        // Close modal and Verify it dissapears. 

        await closeButtonLocator.click()

        await expect(modalTitleLocator).not.toBeVisible({ timeout: 20000 })
        await expect(closeButtonLocator).toBeHidden({ timeout: 20000 })
    }),

    // Incomplete test
    //     test("Download", async ({ page }) => {
    //     // Create downloads directory if it doesn't exist
    //     const downloadPath = path.join(__dirname, 'downloads');
    //     if (!fs.existsSync(downloadPath)) {
    //         fs.mkdirSync(downloadPath, { recursive: true });
    //     }

    //     try {
    //         await page.locator("a[href='/download']").click();
    //         await expect(page).toHaveURL("https://the-internet.herokuapp.com/download");
    //         console.log(`Page Url PASS ${page.url()}`);

    //         // Locate and click to download.
    //         const downloadLink = page.getByRole('link', { name: 'F1GetFileText.txt' });
    //         await expect(downloadLink).toBeVisible();
    //         console.log(`Download link is visible`);

    //         // Start waiting for download before clicking. Note no await.
    //         const downloadPromise = page.waitForEvent('download');

    //         // Wait for download to start
    //         await downloadLink.click();
    //         console.log("Click download");

    //         // Wait for download to start
    //         const download = await downloadPromise;
    //         console.log("Download Started");

    //         // Get suggested filename and create full path
    //         const suggestedFilename = download.suggestedFilename();
    //         const fullPath = path.join(downloadPath, suggestedFilename);

    //         // Save the downloaded file
    //         await download.saveAs(fullPath);
    //         console.log(`✓ File saved to: ${fullPath}`);

    //         // Verify download was successful
    //         expect(await download.failure()).toBeNull();
    //         console.log('✓ Download completed without errors');

    //         // Verify file exists on disk
    //         expect(fs.existsSync(fullPath)).toBeTruthy();
    //         console.log('✓ Downloaded file exists on disk');

    //         // Verify file has content (not empty)
    //         const stats = fs.statSync(fullPath);
    //         expect(stats.size).toBeGreaterThan(0);
    //         console.log('✓ File has content');

    //         // Append "Hello World" to the downloaded file
    //         fs.appendFileSync(fullPath, "\nHello World");
    //         console.log('✓ Appended "Hello World" to downloaded file');

    //         // Read and display the file contents
    //         const fileContent = fs.readFileSync(fullPath, 'utf8');
    //         console.log('📄 File Contents:');
    //         console.log(fileContent);
    //         console.log('--- End of File ---');

    //     } catch (error) {
    //         console.error('Download test failed:', error);
    //         throw error;
    //     } finally {
    //         // Clean up - delete the downloaded file and directory
    //         try {
    //             const suggestedFilename = 'F1GetFileText.txt'; // fallback filename
    //             const fullPath = path.join(downloadPath, suggestedFilename);
                
    //             if (fs.existsSync(fullPath)) {
    //                 fs.unlinkSync(fullPath);
    //                 console.log('✓ Cleaned up downloaded file');
    //             }

    //             if (fs.existsSync(downloadPath)) {
    //                 // Check if directory is empty before removing
    //                 const files = fs.readdirSync(downloadPath);
    //                 if (files.length === 0) {
    //                     fs.rmSync(downloadPath, { recursive: true });
    //                     console.log('✓ Downloads folder deleted');
    //                 } else {
    //                     console.log('✓ Downloads folder not empty, keeping it');
    //                 }
    //             } else {
    //                 console.log('✓ Downloads folder already deleted');
    //             }
    //         } catch (cleanupError) {
    //             console.warn('Cleanup warning:', cleanupError.message);
    //         }
    //     }
    // });

    test("Upload", async ({ page }) => {
        await page.locator("a[href='/upload']").click()
        const currentPage = page.url()
        await expect(page).toHaveURL("https://the-internet.herokuapp.com/upload")
        console.log(`Current Page Confirmed: ${currentPage}`)

        // Create a test file to upload 
        const testFileName = 'test-upload.txt';
        const testFileContent = 'This is a testfile for uploading testing';
        const testFilePath = path.join(__dirname, testFileName);

        // Create a test file
        fs.writeFileSync(testFilePath, testFileContent)

        try {
            // Find the file input 
            const fileInput = page.locator('input[type="file"]');
            await fileInput.setInputFiles(testFilePath);

            // Click the upload button
            await page.click('input[type="submit"]');

            // Wait for the upload to complete and verify success
            // The page should show "File Uploaded!" message
            await expect(page.locator('h3')).toContainText('File Uploaded!')

            // Verify the uploaded file name is displayed
            await expect(page.locator('#uploaded-files'))


        } catch {
            console.log("error ")
        }

    }),

    test("Floating Menu", async ({ page }) => {
        await page.locator("a[href='/floating_menu']").click()
        const currentPage = page.url()
        await expect(page).toHaveURL("https://the-internet.herokuapp.com/floating_menu")
        console.log(`Current Page Confirmed: ${currentPage}`)

        // Locate News/Contact/about buttons all and Confrim its in view
        const newsButtonLocator = page.getByRole('link', { name: 'News' })
        const contactButtonLocator = page.getByText('Contact')
        const aboutButtonLocator = page.getByRole('link', { name: 'About' })
        const homeButtonLocator = page.getByRole('link', { name: 'Home' })

        // Click home button all and assert URL contains new URL with #home
        await homeButtonLocator.click()
        await expect(page).toHaveURL("https://the-internet.herokuapp.com/floating_menu#home")
        console.log("home button clicked assertion test pass #home is in URL")

        await expect(newsButtonLocator).toBeInViewport()
        await expect(contactButtonLocator).toBeInViewport()
        await expect(aboutButtonLocator).toBeInViewport()
        console.log("News/Contact/about buttons all confirmed in viewport")

        // Mouse wheel down
        await page.mouse.wheel(0, 800);

        // Reconfirm News/Contact/about buttons all is still in view after scrolling.
        await expect(newsButtonLocator).toBeInViewport()
        await expect(contactButtonLocator).toBeInViewport()
        await expect(aboutButtonLocator).toBeInViewport()
        console.log("News/Contact/about buttons all still in viewport after scrolling")

        // Screenshot for Visual Confirmation
        await page.screenshot({ path: 'screenshot.png' });
        console.log("screenshot taken Double check visually")

        // Click News button and assert URL contains new URL with #news
        await newsButtonLocator.click()
        await expect(page).toHaveURL("https://the-internet.herokuapp.com/floating_menu#news")
        console.log("News button clicked assertion test pass # news is in URL")

        // Click Contact button all and assert URL contains new URL with #contact
        await contactButtonLocator.click()
        await expect(page).toHaveURL("https://the-internet.herokuapp.com/floating_menu#contact")
        console.log("Contact button clicked assertion test pass #contact is in URL")

        // Mouse wheel down
        await page.mouse.wheel(0, 11800);

        // Reconfirm News/Contact/about buttons all is still in view after scrolling.
        await expect(newsButtonLocator).toBeInViewport()
        await expect(contactButtonLocator).toBeInViewport()
        await expect(aboutButtonLocator).toBeInViewport()
        console.log("News/Contact/about buttons all still in viewport after scrolling")

        // Mouse wheel up all the way
        await page.mouse.wheel(0, -15800);

        // Reconfirm News/Contact/about buttons all is still in view after scrolling.
        await expect(newsButtonLocator).toBeInViewport()
        await expect(contactButtonLocator).toBeInViewport()
        await expect(aboutButtonLocator).toBeInViewport()
        console.log("News/Contact/about buttons all still in viewport after scrolling")

        // Click about button all and assert URL contains new URL with #about
        await aboutButtonLocator.click()
        await expect(page).toHaveURL("https://the-internet.herokuapp.com/floating_menu#about")
        console.log("About button clicked assertion test pass #about is in URL")
    })
    

    
});



import { test, expect } from "@playwright/test";

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

        // Take a screenshot for verification
        await page.screenshot({ path: 'digest_auth_success.png', fullPage: true });

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
        const { context } = await launch();
        const page = await context.newPage();

        // Go to theInternet. mjm
        await page.goto("https://the-internet.herokuapp.com/");

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

    })





























});



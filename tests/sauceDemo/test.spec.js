import { test, expect } from "@playwright/test";
import cssEscape from 'css.escape';

// To run this file only : npx playwright test sauceDemo/test.spec.js


test.describe("Home Page", () => {
    let startTime


    test.beforeAll(() => {
        startTime = Date.now();
    });


    async function loginToSaucedemo(page) {
        await page.goto('https://www.saucedemo.com/', { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
    });


        const correctUser = 'standard_user'
        const correctPass = 'secret_sauce'

        const userTextBoxLocator = page.getByRole("textbox", { name: 'Username' })
        const passwordTextBoxLocator = page.getByRole("textbox", { name: 'Password' })

        await userTextBoxLocator.waitFor({ timeout: 5000 })
        

        await userTextBoxLocator.fill(correctUser)
        await passwordTextBoxLocator.fill(correctPass)
        await page.getByRole("button", { name: 'Login' }).click()

        await page.waitForLoadState('networkidle')
    }

    test("Log in", async ({ page }) => {
        await page.goto('https://www.saucedemo.com/')

        const correctUser = 'standard_user'
        const correctPass = 'secret_sauce'

        const userTextBoxLocator = page.getByRole("textbox", { name: 'Username' })
        const passwordTextBoxLocator = page.getByRole("textbox", { name: 'Password' })

        await expect(userTextBoxLocator).toBeAttached()
        await expect(passwordTextBoxLocator).toBeAttached()

        await userTextBoxLocator.fill(correctUser)
        await passwordTextBoxLocator.fill(correctPass)
        await page.getByRole("button", { name: 'Login' }).click()

        await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html")
        await page.waitForLoadState('networkidle')
    })

    test("Log out", async ({ page }) => {
        await loginToSaucedemo(page)

        // Locate assert existance of hamburger menu, click to open, assert existance of logout, click logout. 
        const hamburgerMenuLocator = page.getByRole('button', { name: 'Open Menu' })
        const logoutButtonLocator = page.getByRole('link', { name: 'Logout' })
        await hamburgerMenuLocator.click()
        await logoutButtonLocator.click()

        // Assertion test: logout success by home page naviagation. 
        await expect(page).toHaveURL("https://www.saucedemo.com/")

    });

    test("Check error Validatons for login", async ({ page }) => {
        await page.goto('https://www.saucedemo.com/')

        // Config.
        const correctUser = 'standard_user'
        const correctPass = 'secret_sauce'
        const incorrectPass = 'no_sauce'

        // Input locators.
        const userTextBoxLocator = page.getByRole("textbox", { name: 'Username' })
        const passwordTextBoxLocator = page.getByRole("textbox", { name: 'Password' })


        // Input a username without pass.
        await userTextBoxLocator.fill(correctUser)

        // Click login button.
        await page.getByRole("button", { name: 'Login' }).click()

        // Assertion test: Correct username and NO password.
        const errorBoxLocator = page.locator('.error-message-container')
        await expect(errorBoxLocator).toContainText("Password is required")


        // Input an incorrect password.
        await passwordTextBoxLocator.fill(incorrectPass)

        // Click login button.
        await page.getByRole("button", { name: 'Login' }).click()

        // Assertion test: Correct username and incorrect password.
        await expect(errorBoxLocator).toContainText('Username and password do not match any user in this service')


        // Input blank username with good password.
        await userTextBoxLocator.fill('')
        await passwordTextBoxLocator.fill(correctPass)

        // Click login button.
        await page.getByRole("button", { name: 'Login' }).click()

        // Assertion test: Correct username and missing password
        await expect(errorBoxLocator).toContainText('Username is required')


        // Input Incorrect username with good password.
        await userTextBoxLocator.fill('asdohjaisuhd kjasd jka')
        await passwordTextBoxLocator.fill(correctPass)

        // Click login button.
        await page.getByRole("button", { name: 'Login' }).click()

        // Get Error text programatically through test.
        await expect(errorBoxLocator).toContainText("Username and password do not match any user in this service")
    })

    test("Open menu bar", async ({ page }) => {
        await loginToSaucedemo(page)

        // Locate all navbar buttons.
        const allItemsButtonLocator = page.getByRole('link', { name: 'All Items' })
        const aboutButtonLocator = page.getByRole('link', { name: 'About' })
        const logoutButtonLocator = page.getByRole('link', { name: 'Logout' })
        const resetButtonLocator = page.getByRole('link', { name: 'Reset App State' })

        // Assertion test: buttons are not in viewport.
        await expect(allItemsButtonLocator).not.toBeInViewport()
        await expect(aboutButtonLocator).not.toBeInViewport()
        await expect(logoutButtonLocator).not.toBeInViewport()
        await expect(resetButtonLocator).not.toBeInViewport()

        // Open Menu bar.
        const hamburgerMenuLocator = page.getByRole('button', { name: 'Open Menu' })
        await hamburgerMenuLocator.click()

        // Assertion test: buttons are in viewport.
        await expect(allItemsButtonLocator).toBeInViewport()
        await expect(aboutButtonLocator).toBeInViewport()
        await expect(logoutButtonLocator).toBeInViewport()
        await expect(resetButtonLocator).toBeInViewport()

    });

    test("Close menu bar", async ({ page }) => {
        await loginToSaucedemo(page)

        // Locate all navbar buttons.
        const allItemsButtonLocator = page.getByRole('link', { name: 'All Items' })
        const aboutButtonLocator = page.getByRole('link', { name: 'About' })
        const logoutButtonLocator = page.getByRole('link', { name: 'Logout' })
        const resetButtonLocator = page.getByRole('link', { name: 'Reset App State' })

        // Open Menu bar.
        const hamburgerMenuLocator = page.getByRole('button', { name: 'Open Menu' })
        await hamburgerMenuLocator.click()

        // Assertion test: buttons are in viewport.
        await expect(allItemsButtonLocator).toBeInViewport()
        await expect(aboutButtonLocator).toBeInViewport()
        await expect(logoutButtonLocator).toBeInViewport()
        await expect(resetButtonLocator).toBeInViewport()

        // Close the menu bar.
        const closeButtonLocator = page.getByRole('button', { name: 'Close Menu' })
        await closeButtonLocator.click()

        // Assertion test: buttons are not in viewport.
        await expect(allItemsButtonLocator).not.toBeInViewport()
        await expect(aboutButtonLocator).not.toBeInViewport()
        await expect(logoutButtonLocator).not.toBeInViewport()
        await expect(resetButtonLocator).not.toBeInViewport()


    })

    test("Verify Landing Page products", async ({ page }) => {
        await loginToSaucedemo(page)

        // Products.
        const expectedProducts = [
            'Sauce Labs Backpack',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Onesie',
            'Sauce Labs Bike Light',
            'Sauce Labs Fleece Jacket',
            'Test.allTheThings() T-Shirt (Red)'
        ]

        // Prices.
        const expectedPrices = [
            '29.99',
            '9.99',
            '15.99',
            '49.99',
            '7.99',
            '15.99',
        ]

        // Verify all expected products for visibility.
        let visibleProducts = 0
        for (const product of expectedProducts) {
           
            const productLocator = page.locator(".inventory_item_name", { hasText: product })
            // Assertion test: Verify individual product visibility.
            await expect(productLocator).toBeVisible()
            visibleProducts ++
        }

        // Assertion test: Verify matching count of 6.
        await expect(visibleProducts).toBe(6)

        // Track occuranges for duplicate prices.
        const priceCount = {}
        for (let price of expectedPrices) {
            // Increment count for this price. (handles duplicates)
            priceCount[price] = (priceCount[price] || 0) + 1;
            const priceLocators = page.getByText(`$${price}`);
            // Select the nth occurance. (count - 1 for zero based index)
            const locator = priceLocators.nth(priceCount[price] - 1);
            await locator.scrollIntoViewIfNeeded()
            await expect(locator).toBeInViewport()
        }

        // Locate and init inventory count.
        const inventoryCountLocator = page.locator('div[data-test="inventory-item"]')
        const inventoryCount = await inventoryCountLocator.count()

        // Assertion test: inventory items.
        await expect(inventoryCount).toBe(6)
    });

    test("Reset App State", async ({ page }) => {
        await loginToSaucedemo(page)

        // Shopping cart badge locator for test.
        const shoppingCartBadgeLocator = page.locator("span.shopping_cart_badge")

        // Pre assertion test: locator shouldnt be present.
        await expect(shoppingCartBadgeLocator).toBeHidden();

        // Merchandise locators.
        const backPackBTNLocator = page.locator("button#add-to-cart-sauce-labs-backpack")
        const tShirtBTNLocator = page.locator("button#add-to-cart-sauce-labs-bolt-t-shirt")
        const onesieBtnLocator = page.locator("button#add-to-cart-sauce-labs-onesie")

        // Click merchandise buttons.
        await backPackBTNLocator.click()
        await tShirtBTNLocator.click()
        await onesieBtnLocator.click()

        // Assertion test: Shopping cart badge contains text 3 and is visible.
        await expect(shoppingCartBadgeLocator).toBeVisible();
        await expect(shoppingCartBadgeLocator).toContainText('3')

        // Click open menu button.
        await page.getByRole('button', { name: 'Open Menu' }).click()

        // Click Reset App State button.
        await page.getByRole('link', { name: 'Reset App State' }).click()

        // Assertion test: Shopping cart badge is hidden.
        await expect(shoppingCartBadgeLocator).toBeHidden();
        console.log("Assertion Test: Shopping Cart contains no badge")
    });

    test("Navigate to cart summary", async ({ page }) => {
        await loginToSaucedemo(page)

        // Locate and click shopping cart button.
        const shoppingCartLocator = page.locator("a.shopping_cart_link")
        await shoppingCartLocator.click()

        // Assertion test: Confirm navigation cart summary.
        await expect(page).toHaveURL('https://www.saucedemo.com/cart.html')

        // Click open menu button.
        await page.getByRole('button', { name: 'Open Menu' }).click()
    });

    test("Navigate to about", async ({ page }) => {
        await loginToSaucedemo(page)

        // Click open menu button.
        await page.getByRole('button', { name: 'Open Menu' }).click()

        // Click on about link.
        const aboutButtonLocator = page.getByRole('link', { name: 'About' })
        await aboutButtonLocator.click()

        // Assertion test: Confirm navigation about page.
        await expect(page).toHaveURL('https://saucelabs.com/')
    })

    test("Navigate to All Items", async ({ page }) => {
        await loginToSaucedemo(page)

        // Locate and click shopping cart button.
        const shoppingCartLocator = page.locator("a.shopping_cart_link")
        await shoppingCartLocator.click()

        // Assertion test: Confirm navigation cart summary.
        await expect(page).toHaveURL('https://www.saucedemo.com/cart.html')

        // Click open menu button.
        await page.getByRole('button', { name: 'Open Menu' }).click()

        // Click all items button. 
        await page.getByRole('link', { name: 'All Items' }).click()

        // Assertion test: URL for About page results.
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')

    })

    test("Order by Name A - Z", async ({ page }) => {
        await loginToSaucedemo(page)

        // inventory locator, wait by assert locator and initialize the list of items.
        const inventoryItemNameLocator = page.locator('.inventory_item_name')
        await expect(inventoryItemNameLocator).toHaveCount(6);
        const namesOfInventory = await inventoryItemNameLocator.allTextContents()

        // Assertion test: compare existing A-Z Default list to sorted A-Z list.
        const sortedInventory = [...namesOfInventory].sort((a, b) => a.localeCompare(b))
        expect(namesOfInventory).toEqual(sortedInventory)
    });

    test("Order by Name Z - A", async ({ page }) => {
        await loginToSaucedemo(page)

        // inventory locator.
        const inventoryItemNameLocator = page.locator('.inventory_item_name')

        // Click on sort z - a.
        await page.locator('[data-test="product-sort-container"]').selectOption('za');
        await expect(inventoryItemNameLocator).toHaveCount(6);
        const ztoaNamesOfInventory = await inventoryItemNameLocator.allTextContents()

        // Assertion test: sort Z-A reverse alphabetically and compare.
        const sortedZToANamesOfInventory = [...ztoaNamesOfInventory].sort((a, b) => b.localeCompare(a))
        expect(ztoaNamesOfInventory).toEqual(sortedZToANamesOfInventory);
    })

    test("Order by Price Low to High", async ({ page }) => {
        await loginToSaucedemo(page)

        const inventoryPriceLocators = page.locator('[data-test="inventory-item-price"]')
        const comboBoxLocator = page.getByRole("combobox");
        await expect(comboBoxLocator).toBeEnabled();

        // Select Lo - Hi Filter.
        await comboBoxLocator.selectOption('lohi');
        await expect(inventoryPriceLocators).toHaveCount(6);

        // Get prices format prices without $ and parseFloat.
        const pricesOfInventory = await inventoryPriceLocators.allTextContents();
        const formattedPrices = pricesOfInventory.map(price => parseFloat(price.replace('$', "")))

        // Make a sorted copy for comparison.
        const sortedPrices = [...formattedPrices].sort((a, b) => a - b)

        // Assertion test: compare prices are sorted.
        await expect(formattedPrices).toEqual(sortedPrices);
    });

    test("Order by Price High to Low", async ({ page }) => {
        await loginToSaucedemo(page)

        const inventoryPriceLocators = page.locator('[data-test="inventory-item-price"]')
        const comboBoxLocator = page.getByRole("combobox");
        await expect(comboBoxLocator).toBeEnabled();

        // Select Hi - Lo Filter.
        await page.locator('[data-test="product-sort-container"]').selectOption('hilo');
        await expect(inventoryPriceLocators).toHaveCount(6);

        // Get prices format prices without $ and parseFloat.
        const productPrices = await inventoryPriceLocators.allTextContents();
        const formattedPrices = productPrices.map((price) => parseFloat(price.replace('$', "")))

        // Make a sorted copy for comparison.
        const sortedPrices = [...formattedPrices].sort((a, b) => b - a)

        // Assertion test: compare prices are sorted.
        await expect(formattedPrices).toEqual(sortedPrices)
    })

    test("Go to product detail page", async ({ page }) => {
        await loginToSaucedemo(page)

        // Locate, assert wait, click details link.
        const backpackDetailsButton = page.locator("[data-test='item-4-title-link']")
        await expect(backpackDetailsButton).toBeEnabled()
        await expect(backpackDetailsButton).toBeVisible()
        await backpackDetailsButton.click()

        // Assertion test: Expected detail page URL.
        await expect(page).toHaveURL("https://www.saucedemo.com/inventory-item.html?id=4")
        await expect(page.locator('[data-test="inventory-item-name"]')).toBeVisible()
    })


    test("Verify cart badge matches items added in cart", async ({ page }) => {
        await loginToSaucedemo(page)

        // Locators for items.
        const shoppingCartBadge = page.locator("span.shopping_cart_badge")

        const merch = [
            'sauce-labs-backpack',
            'sauce-labs-bolt-t-shirt',
            'sauce-labs-onesie',
            'sauce-labs-bike-light',
            'sauce-labs-fleece-jacket',
            'test.allthethings()-t-shirt-(red)'
        ];

        await expect(shoppingCartBadge).toBeHidden()

        // #npm install css.escape and import at the top.
        // Loop each item expect visibility, click, add to count, and compare badge to expectedCounnt #npm install css.escape.
        let expectedCount = 0
        for (const element of merch) {
            const merchAddButton = page.locator(`button#add-to-cart-${cssEscape(element)}`)
            await expect(merchAddButton).toBeVisible()
            await merchAddButton.click()

            expectedCount++
            await expect(shoppingCartBadge).toContainText(expectedCount.toString())
        };

        // Loop each delete button locator and expect visibility, click ,subtract from count and compare badge to expected count.
        for (const element of merch) {
            const merchDeleteButton = page.locator(`button#remove-${cssEscape(element)}`)
            await expect(merchDeleteButton).toBeVisible()
            await merchDeleteButton.click()

            expectedCount--
            if (expectedCount === 0) {
                await expect(shoppingCartBadge).toBeHidden()
            } else {
                await expect(shoppingCartBadge).toContainText(expectedCount.toString())
            }

        }
    });

    async function addFirstItemToCart(page) {
        const anyAddButton = page.locator('[id^="add-to-cart-"]').first();
        await anyAddButton.click();
    }

    test("Add item to cart from inventory page", async ({ page }) => {
        await loginToSaucedemo(page)
        
        // Click add button.
        const anyAddButton = page.locator('[id^="add-to-cart-"]').first();
        await anyAddButton.click();

        const shoppingCartBadgeLocator = page.locator("span.shopping_cart_badge")
        
        // Assertion Test: Badge confirms item.
        await expect(shoppingCartBadgeLocator).toContainText("1")
    })

    test("Remove item from cart from inventory page", async ({ page }) => {
        await loginToSaucedemo(page)
        await addFirstItemToCart(page)

        const shoppingCartBadgeLocator = page.locator("span.shopping_cart_badge")

        // Assertion Test: Badge confirms item.
        await expect(shoppingCartBadgeLocator).toContainText("1")

        // Get add button count, Pre Assertion Test: Expected count of add buttons.
        const anyAddButton = page.getByRole("button", { name: "Add to cart" })
        const addButtonCount = await anyAddButton.count()
        await expect(addButtonCount).toBe(5)

        // Init variable to easy access, get delete button locator.
        const anyDeleteButton = page.getByRole("button", { name: "Remove" }).first()
        await anyDeleteButton.click()

        // Assertion Test: No badge confirms item removed from cart.
        await expect(shoppingCartBadgeLocator).toBeHidden()

        // Assertion Test: No remove buttons left confirm's empty cart.
        const newAddButtonCount = await anyAddButton.count()
        await expect(newAddButtonCount).toBe(addButtonCount + 1)
    })

    async function navigateToRandomDetailPage(page) {
        const merch = [
            'Sauce Labs Backpack',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Onesie',
            'Sauce Labs Bike Light',
            'Sauce Labs Fleece Jacket',
            'Test.allTheThings() T-Shirt (Red)'
        ];

        const randomMerchIndex = Math.floor(Math.random() * merch.length)
        const randomMerchName = merch[randomMerchIndex]


        const randomMerch = page.locator(".inventory_item_name").filter({ hasText: randomMerchName })

        await randomMerch.click()

        // Return for use in TEST! COOOOL
        return randomMerchName
    }

    test("Add item from product detail page", async ({ page }) => {
        await loginToSaucedemo(page)
        await navigateToRandomDetailPage(page)

        // Assertion test: Arrived at random detail page.
        await expect(page).toHaveURL(/https:\/\/www\.saucedemo\.com\/inventory-item\.html\?id=[0-5]$/);

        // Shopping cart locator.
        const shoppingCartBadgeLocator = page.locator("span.shopping_cart_badge")

        // Assertion cart has 0 item.
        await expect(shoppingCartBadgeLocator).toBeHidden()

        // Add item by click.
        await page.getByRole('button', { name: 'Add to cart' }).click()

        // Assertion cart has 1 item.
        await expect(shoppingCartBadgeLocator).toBeVisible()
        await expect(shoppingCartBadgeLocator).toContainText("1")
    })



    test("Remove item from product detail page", async ({ page }) => {
        await loginToSaucedemo(page)
        await navigateToRandomDetailPage(page)

        // Assertion test: Arrived at random detail page.
        await expect(page).toHaveURL(/https:\/\/www\.saucedemo\.com\/inventory-item\.html\?id=[0-5]$/);

        // Shopping cart locator.
        const shoppingCartBadgeLocator = page.locator("span.shopping_cart_badge")

        // Assertion cart has 0 item.
        await expect(shoppingCartBadgeLocator).toBeHidden()

        // Add item by click.
        await page.getByRole('button', { name: 'Add to cart' }).click()

        // Pre Assertion cart has 1 item.
        await expect(shoppingCartBadgeLocator).toBeVisible()
        await expect(shoppingCartBadgeLocator).toContainText("1")

        // Remove from shopping cart and assert items are gone.
        const removeButtonLocator = page.getByRole("button", { name: "Remove" })
        await removeButtonLocator.click()
        await expect(removeButtonLocator).toBeHidden();
        await expect(shoppingCartBadgeLocator).toBeHidden()
    })

    test("Remove item from cart summary page", async ({ page }) => {
        await loginToSaucedemo(page)
        const theRandomItem = await navigateToRandomDetailPage(page)

        // Assertion test: Arrived at random detail page.
        await expect(page).toHaveURL(/https:\/\/www\.saucedemo\.com\/inventory-item\.html\?id=[0-5]$/);

        // Add item by click.
        await page.getByRole('button', { name: 'Add to cart' }).click()

        // Navigate to cart summary page and assertion that we are in correct url. 
        const cartNavButton = page.locator("a.shopping_cart_link")
        await cartNavButton.click()
        await expect(page).toHaveURL("https://www.saucedemo.com/cart.html")

        // Locate and get cart quantity item count.
        const cartQuantity = page.locator(".cart_quantity", { hasText: /^[1-6]$/ })
        const theNumber = await cartQuantity.count()

        // Assertion test: compare count of items in cart.
        await expect(theNumber).toBe(1)

        // Format item name to match ID.
        const formattedRandomItemToID = theRandomItem.split(" ").join("-").toLowerCase()

        // Click the random item by id.
        await page.locator(`button#remove-${cssEscape(formattedRandomItemToID)}`).click()

        // Get new count for test.
        const theNumberAfter = await cartQuantity.count()

        // Assertion test: compare count of items in cart.
        await expect(theNumberAfter).toBe(0)

    });

    test("Go through checkout process", async ({ page }) => {
        await loginToSaucedemo(page)
        await navigateToRandomDetailPage(page)

        // Config.
        const firstName = "Michael"
        const lastName = "Mirisciotta"
        const zipCode = "94578"

        // Add item by click.
        await page.getByRole('button', { name: 'Add to cart' }).click()

        // Navigate to cart summary page and assertion that we are in correct url.
        const cartNavButton = page.locator("a.shopping_cart_link")
        await cartNavButton.click()
        await expect(page).toHaveURL("https://www.saucedemo.com/cart.html")

        // Navigate to checkout by click.
        await page.getByRole('button', { name: "Checkout" }).click()

        // Assertion Test: compare URL.
        await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-one.html")

        // Locate inputs.
        const firstNameInputLocator = page.getByRole("textbox", { name: "First Name" })
        const lastNameInputLocator = page.getByRole("textbox", { name: "Last Name" })
        const zipCodeLocator = page.getByRole("textbox", { name: "Zip/Postal Code" })

        // Fill in with locators. 
        await firstNameInputLocator.fill(firstName)
        await lastNameInputLocator.fill(lastName)
        await zipCodeLocator.fill(zipCode)

        // Press Continue button.
        const continueButtonLocator = page.getByRole("button", { name: "Continue" })
        await continueButtonLocator.click()
        await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-two.html")

        // Click finish button, Check Next URL.
        const finishButton = page.getByRole("button", { name: "Finish" })
        await expect(finishButton).toBeEnabled()
        await finishButton.click()

        // Locate Confirm text.
        const confirmTextLocator = page.locator("div.complete-text")

        // Assertion Test: Confirmation page.
        await expect(page).toHaveURL("https://www.saucedemo.com/checkout-complete.html")
        await expect(confirmTextLocator).toBeInViewport()
        await expect(confirmTextLocator).toHaveText("Your order has been dispatched, and will arrive just as fast as the pony can get there!")

    });

    test("Check error validations for checkout information", async ({ page }) => {
        await loginToSaucedemo(page)

        // Config Checkout Variables.
        const FirstName = "Michael"
        const LastName = "Mirisciotta"
        const ZipCode = "94578"

        // Quickly navigate to Checkout.
        await page.locator("button#add-to-cart-sauce-labs-bolt-t-shirt").click()
        await page.locator("a.shopping_cart_link").click()
        await page.getByRole("button", { name: "Checkout" }).click()

        // Locators for test inputs.  
        const firstNameInputLocator = page.getByRole("textbox", { name: "First Name" })
        const lastNameInputLocator = page.getByRole("textbox", { name: "Last Name" })
        const zipCodeLocator = page.getByRole("textbox", { name: "Zip/Postal Code" })

        // Fill looking for First Name error press Continue button. 
        await lastNameInputLocator.fill(LastName)
        await zipCodeLocator.fill(ZipCode)
        await page.getByRole("button", { name: "Continue" }).click()

        // Locate error visibility and assertion. 
        const errorMessageFirstNameLocator = page.getByText('Error: First Name is required')

        // Assertion Test: Postal code error.
        await expect(errorMessageFirstNameLocator).toBeVisible();

        // Edit fills looking for Last Name error, press continue button. 
        await firstNameInputLocator.fill(FirstName)
        await lastNameInputLocator.fill("")
        await zipCodeLocator.fill(ZipCode)
        await page.getByRole("button", { name: "Continue" }).click()

        // Locate error visibility and assertion. 
        const errorMessageLastNameLocator = page.getByText("Error: Last Name is required")

        // Assertion Test: Postal code error.
        await expect(errorMessageLastNameLocator).toBeVisible()

        // Edit fills looking for Zipcode error, press continue button. 
        await firstNameInputLocator.fill(FirstName)
        await lastNameInputLocator.fill(LastName)
        await zipCodeLocator.fill("")
        await page.getByRole("button", { name: "Continue" }).click()

        // Locate Zipcode error visibility and assertion. 
        const errorMessageZipCodeLocator = page.getByText("Error: Postal Code is required")

        // Assertion Test: Postal code error.
        await expect(errorMessageZipCodeLocator).toBeVisible()
    });

    // Helper function for quick checkout
    async function setupCheckoutWithItem(page, firstName = "Michael", lastName = "Mirisciotta", zipCode = "94578") {
        await page.locator("button#add-to-cart-sauce-labs-bolt-t-shirt").click()
        await page.locator("a.shopping_cart_link").click()
        await page.getByRole("button", { name: "Checkout" }).click()

        await page.getByRole("textbox", { name: "First Name" }).fill(firstName)
        await page.getByRole("textbox", { name: "Last Name" }).fill(lastName)
        await page.getByRole("textbox", { name: "Zip/Postal Code" }).fill(zipCode)
        await page.getByRole("button", { name: "Continue" }).click()
    }

    test("Navigate back to home after checkout", async ({ page }) => {
        await loginToSaucedemo(page)
        await setupCheckoutWithItem(page)

        // Locate assert existance and press Finish button. 
        const finishButtonLocator = page.getByRole("button", { name: "Finish" })
        await finishButtonLocator.click()
        await expect(page).toHaveURL("https://www.saucedemo.com/checkout-complete.html")

        // Locate assert existance and click Home button. 
        const homeButtonLocator = page.getByRole("button", { name: "Back Home" })
        await homeButtonLocator.click()

        // // Assertion Test: Test home page URL.
        await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html")
    })

    test.afterAll(() => {
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`🏁 Tests completed in ${duration} seconds`);
    });
})
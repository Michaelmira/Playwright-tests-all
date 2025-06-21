const { chromium } = require("playwright");

async function testHackerNews() {
    let totalTests = 0;
    let totalTestsPassed = 0;
    const startTime = Date.now();

    // launch browser
    let browser;
    try {
        console.log("🚀 Starting Hacker News multi-page tests...");
        browser = await chromium.launch({ headless: false }); // Using headless:false for visual debugging mjm
        const context = await browser.newContext();
        const page = await context.newPage();

        totalTests++;
        // Test #1 Do we have the correct URL and title? mjm
        console.log("🔄 Test 1 Start: Initial Page Navigation");
        await page.goto("https://news.ycombinator.com/newest", { waitUntil: "networkidle" });
        const pageTitle = await page.title();
        const currentUrl = page.url();
        const expectedUrl = "https://news.ycombinator.com/newest";
        const expectedTitle = "Hacker News";

        console.log(`Current URL: ${currentUrl}`);
        console.log(`Page Title: ${pageTitle}`);

        const isCorrectUrl = currentUrl.includes(expectedUrl);
        const isCorrectTitle = pageTitle.includes(expectedTitle);

        if (isCorrectUrl && isCorrectTitle) {
            console.log(`✅ Test 1 Passed: Expected URL contains ${expectedUrl} and title contains ${expectedTitle}`);
            totalTestsPassed++;
        } else {
            console.error(`❌ Test 1 Failed: URL or title mismatch.`);
            if (!isCorrectUrl) console.error(`  Expected URL to contain "${expectedUrl}", but got "${currentUrl}"`);
            if (!isCorrectTitle) console.error(`  Expected title to contain "${expectedTitle}", but got "${pageTitle}"`);
        }

        // Set up for multi-page testing mjm
        const allArticles = [];
        let targetArticleCount = 100;
        let currentPage = 1;

        // Keep testing until we reach 100 articles or run out of pages mjm
        while (allArticles.length < targetArticleCount) {
            console.log(`\n📄 Processing Page ${currentPage}`);
            await page.waitForSelector('.athing', { state: 'attached' });

            // Get articles from current page mjm
            const pageArticles = await page.$$eval(".athing", (rows) => {
                return rows.map((row) => {
                    const id = row.getAttribute("id");
                    const title = row.querySelector(".titleline a")?.innerText || "No title";
                    const url = row.querySelector(".titleline a")?.href || "";
                    const ageElement = document.querySelector(`#score_${id} ~ .age a`);
                    const timeString = ageElement ? ageElement.getAttribute("title") : null;
                    const time = timeString ? new Date(timeString).getTime() : 0;
                    return { id, title, url, time, timeString };
                });
            });

            console.log(`Found ${pageArticles.length} articles on page ${currentPage}`);

            // Add counter to articles and add them to our collection mjm
            const startIndex = allArticles.length;
            pageArticles.forEach((article, index) => {
                article.counter = startIndex + index + 1;
                
                // Only add articles if we're still under our target count mjm
                if (allArticles.length < targetArticleCount) {
                    allArticles.push(article);
                }
            });

            console.log(`Total articles collected so far: ${allArticles.length}/${targetArticleCount}`);

            // Show the articles collected from this page (first 5 only to avoid clutter) mjm
            console.log("\n📋 Articles from this page:");
            pageArticles.slice(0, Math.min(5, pageArticles.length)).forEach((article) => {
                if (article.counter <= targetArticleCount) {
                    console.log(`Article #${article.counter}: "${article.title.substring(0, 50)}${article.title.length > 50 ? '...' : ''}" (${new Date(article.time).toLocaleString()})`);
                }
            });

            // Check if we've reached our target count mjm
            if (allArticles.length >= targetArticleCount) {
                console.log(`\n✅ Reached target of ${targetArticleCount} articles. Stopping pagination.`);
                break;
            }

            // Check if there's a "More" link mjm
            const hasMoreLink = await page.$$eval("a.morelink", (links) => links.length > 0);
            if (!hasMoreLink) {
                console.log("\n⚠️ No 'More' link found. Reached the end of available pages.");
                break;
            }

            // Go to next page mjm
            console.log("\n⏭️ Navigating to next page...");
            await page.click("a.morelink");
            await page.waitForLoadState("networkidle");
            currentPage++;
        }

        // Now run our tests on the collected articles mjm
        if (allArticles.length === 0) {
            console.log("❌ No articles found - test failed");
            process.exit(1);
        } else {
            totalTests++;
            // Test #2 Article chronological order test mjm
            console.log("\n🔄 Test 2 Start: Article Chronological Order (Across Pages)");
            
            // Display the first and last article titles with counters mjm
            console.log(`First Article #${allArticles[0].counter}: "${allArticles[0].title}"`);
            console.log(`Last Article #${allArticles[allArticles.length - 1].counter}: "${allArticles[allArticles.length - 1].title}"`);

            // Check timestamps of first and last articles mjm
            const firstTime = allArticles[0].timeString;
            const lastTime = allArticles[allArticles.length - 1].timeString;
            const firstDate = new Date(firstTime);
            const lastDate = new Date(lastTime);
            console.log(`First article timestamp: ${firstDate}`);
            console.log(`Last article timestamp: ${lastDate}`);

            // Verify reverse chronological order (newest first) mjm
            const sortedCorrectly = allArticles.every((article, index, arr) => {
                return index === 0 || article.time <= arr[index - 1].time;
            });

            if (sortedCorrectly) {
                console.log("✅ Test 2 Passed: Articles are sorted correctly in reverse chronological order (newest first)!");
                totalTestsPassed++;
            } else {
                console.error("❌ Test 2 Failed: Articles are NOT sorted correctly");
            }

            totalTests++;
            // Test #3 Find any articles out of chronological order mjm
            console.log("\n🔄 Test 3 Start: Detailed Order Analysis");
            let outOfOrderCount = 0;

            allArticles.forEach((article, index, arr) => {
                if (index > 0) {
                    const prevArticle = arr[index - 1];
                    if (article.time > prevArticle.time) {
                        outOfOrderCount++;
                        console.log(`❌ Out of order: Article #${article.counter} (${new Date(article.time).toISOString()}) ` +
                        `is newer than article #${prevArticle.counter} (${new Date(prevArticle.time).toISOString()})`);
                    }
                }
            });

            if (outOfOrderCount === 0) {
                console.log("✅ Test 3 Passed: All articles are perfectly in order");
                totalTestsPassed++;
            } else {
                console.error(`❌ Test 3 Failed: Found ${outOfOrderCount} articles out of order`);
            }

            totalTests++;
            // Test #4 Check for duplicate articles mjm
            console.log("\n🔄 Test 4 Start: Duplicate Article Check");
            const titleMap = new Map(); // Map to store title and its counter mjm
            const duplicates = [];

            allArticles.forEach(article => {
                if (titleMap.has(article.title)) {
                    duplicates.push({
                        title: article.title,
                        firstCounter: titleMap.get(article.title),
                        secondCounter: article.counter
                    });
                } else {
                    titleMap.set(article.title, article.counter);
                }
            });

            if (duplicates.length === 0) {
                console.log("✅ Test 4 Passed: No duplicate articles found");
                totalTestsPassed++;
            } else {
                console.error(`❌ Test 4 Failed: Found ${duplicates.length} duplicate articles:`);
                duplicates.forEach(dup => 
                    console.log(`  - "${dup.title}" (Articles #${dup.firstCounter} and #${dup.secondCounter})`)
                );
            }

            totalTests++;
            // Test #5 Article content check mjm
            console.log("\n🔄 Test 5 Start: Article Content Check");
            const emptyTitles = allArticles.filter(article => !article.title || article.title === "No title");

            if (emptyTitles.length === 0) {
                console.log("✅ Test 5 Passed: All articles have titles");
                totalTestsPassed++;
            } else {
                console.error(`❌ Test 5 Failed: Found ${emptyTitles.length} articles without titles:`);
                emptyTitles.forEach(article => 
                    console.log(`  - Article #${article.counter} has no title`)
                );
            }
            
            // Print a summary of all articles collected with counters mjm
            console.log("\n📋 Full Articles Summary:");
            console.log(`Total articles collected: ${allArticles.length}`);
            console.log(`Pages processed: ${currentPage}`);
            console.log(`Date range: ${firstDate.toLocaleString()} to ${lastDate.toLocaleString()}`);
            
            // Show the first 5 and last 5 articles mjm
            console.log("\nFirst 5 articles:");
            allArticles.slice(0, 5).forEach((article) => {
                console.log(`Article #${article.counter}: "${article.title.substring(0, 50)}${article.title.length > 50 ? '...' : ''}" (${new Date(article.time).toLocaleString()})`);
            });
            
            if (allArticles.length > 10) {
                console.log("\n... middle articles omitted ...");
                
                console.log("\nLast 5 articles:");
                allArticles.slice(-5).forEach((article) => {
                    console.log(`Article #${article.counter}: "${article.title.substring(0, 50)}${article.title.length > 50 ? '...' : ''}" (${new Date(article.time).toLocaleString()})`);
                });
            }
        }

    } catch (error) {
        console.error("❌ Test failed with error:", error);
        process.exit(1);
    } finally {
        // Display test statistics mjm
        if (totalTestsPassed === totalTests) {
            console.log(`✅ Test Summary Success: ${totalTestsPassed} out of ${totalTests} passed successfully.`);
        } else {
            console.log(`❌ Test Summary Fail: ${totalTestsPassed} out of ${totalTests} passed successfully.`);
        }

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`🏁 Tests completed in ${duration} seconds`);

        // Close the browser mjm
        if (browser) {
            await browser.close();
        }
    }
}

// Execute tests mjm
(async () => {
    await testHackerNews();
})();
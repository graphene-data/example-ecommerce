const { chromium } = require('playwright');

async function takeScreenshot() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Navigate to netlify.com
  await page.goto('https://netlify.com');
  
  // Wait for the page to load
  await page.waitForLoadState('domcontentloaded');
  
  // Take screenshot
  await page.screenshot({ path: 'netlify-screenshot.png', fullPage: true });
  
  // Extract page content for analysis
  const content = {
    title: await page.title(),
    headings: await page.evaluate(() => {
      const h1s = Array.from(document.querySelectorAll('h1')).map(h => h.textContent.trim());
      const h2s = Array.from(document.querySelectorAll('h2')).map(h => h.textContent.trim());
      const h3s = Array.from(document.querySelectorAll('h3')).map(h => h.textContent.trim());
      return { h1: h1s, h2: h2s, h3: h3s };
    }),
    mainText: await page.evaluate(() => {
      // Get text from main content areas
      const main = document.querySelector('main') || document.body;
      const paragraphs = Array.from(main.querySelectorAll('p')).map(p => p.textContent.trim()).filter(text => text.length > 50);
      return paragraphs.slice(0, 10); // First 10 substantial paragraphs
    }),
    navigation: await page.evaluate(() => {
      const navItems = Array.from(document.querySelectorAll('nav a, header a')).map(a => a.textContent.trim()).filter(text => text.length > 0);
      return [...new Set(navItems)]; // Remove duplicates
    })
  };
  
  console.log('Screenshot taken: netlify-screenshot.png');
  console.log('Page analysis:');
  console.log(JSON.stringify(content, null, 2));
  
  await browser.close();
  return content;
}

takeScreenshot().catch(console.error);
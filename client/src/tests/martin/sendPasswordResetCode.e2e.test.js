import puppeteer from 'puppeteer';

async function forgotPasswordTest() {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 }); // Adjust headless and slowMo as needed
  const page = await browser.newPage();

  try {
    // Navigate to the Forgot Password page
    await page.goto('http://localhost:3000/forgot-password', { waitUntil: 'networkidle0' });
    console.log("Forgot Password page loaded.");

    // Enter the email address
    await page.type('input[name="email"]', 'billgates@ntnu.no');
    console.log("Email entered.");

    // Click the 'Send Reset Code' button
    await page.click('button[type="submit"]');
    console.log("Request to send reset code submitted.");


  } catch (error) {
    console.error('An error occurred during the Forgot Password test:', error);
  } finally {
    await browser.close();
  }
}

forgotPasswordTest();

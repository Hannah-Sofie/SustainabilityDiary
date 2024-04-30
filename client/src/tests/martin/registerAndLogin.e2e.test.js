import puppeteer from "puppeteer";

async function registerAndLogin() {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();

  try {
    // Navigate to the registration page
    await page.goto('http://localhost:3000/register');

    // Generate a random email and username
    const randomId = Math.floor(Math.random() * 1000);
    const email = `testuser${randomId}@ntnu.no`;
    const name = `Test User ${randomId}`;

    // Fill the registration form
    await page.type('input[name="name"]', name);
    await page.type('input[name="email"]', email);
    await page.type('input[name="password"]', '123@ABC.com');
    await page.click('button[type="submit"]');

    // Wait for navigation to login page
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    console.log(`Registration successful for ${email}`);

    // Navigate to the login page
    await page.goto('http://localhost:3000/login');

    // Fill the login form with the same credentials
    await page.type('input[name="email"]', email);
    await page.type('input[name="password"]', '123@ABC.com');
    await page.click('button[type="submit"]');

    // Wait for successful login navigation
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    console.log(`Login successful for ${email}`);
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await page.close();
    await browser.close();
  }
}

registerAndLogin();

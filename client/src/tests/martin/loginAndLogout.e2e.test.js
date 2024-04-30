import puppeteer from 'puppeteer';

async function automateLoginAndLogout(email, password) {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();

  try {
    // Go to the login page
    await page.goto('http://localhost:3000/login');

    // Enter email and password, then click the login button
    await page.type('input[name="email"]', email);
    await page.type('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForNavigation();

    // Wait for the sidebar to ensure login was successful
    await page.waitForSelector('.container-sidebar', { visible: true });

    // Click on the logout button
    await page.click('#logout-button');
    await page.waitForNavigation();

    console.log(`Successfully logged out ${email}`);
  } catch (error) {
    console.error(`An error occurred with ${email}:`, error);
  } finally {
    await page.close();
    await browser.close();
  }
}

// Perform login and logout for both email addresses
automateLoginAndLogout('billgates@ntnu.no', '123@ABC.com').then(() => {
  automateLoginAndLogout('billgates@stud.ntnu.no', '123@ABC.com');
});

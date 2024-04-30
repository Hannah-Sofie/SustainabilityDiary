const puppeteer = require('puppeteer');

jest.setTimeout(30000);

describe('Registration', () => {
  let browser;
  let page;

    beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
    });

  afterAll(async () => {
    await browser.close();
  });
  

  test('should register', async () => {
    // go to registration page
    await page.goto('http://localhost:3000/register');

    // Generate a random 5-digit number
    const randomId = Math.floor(10000 + Math.random() * 90000);

    // Append the randomId to the email
    const email = `test${randomId}@ntnu.no`;

    await page.waitForSelector('input[name=name]');
    await page.type('input[name=name]', 'Test User');
    await page.type('input[name=email]', email);
    await page.type('input[name=password]', 'Test12345!');

    // Submit the registration form
    await Promise.all([
      page.waitForNavigation(),
      page.click('button[type=submit]'), 
    ]);

    // We should now be on the login page
    expect(page.url()).toBe('http://localhost:3000/login');


  }, 16000);
});
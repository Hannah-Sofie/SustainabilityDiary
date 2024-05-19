const {
  describe,
  it,
  after,
  before,
  afterEach,
  beforeEach,
} = require("node:test");
const assert = require("node:assert");
const puppeteer = require("puppeteer");

describe("Authentication Flow Tests", () => {
  let browser, page;

  before(async () => {
    browser = await puppeteer.launch({
      headless: false, // Set to true for automated testing environments
      slowMo: 100, // Slow motion delay for visual debugging
      args: ["--window-size=1440,1000"],
    });
  });

  after(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1000 });
    // Detailed console and error logging
    page.on("console", (message) =>
      (`Browser Console: ${message.text()}`)
    );
    page.on("pageerror", (error) =>
      console.error(`Browser Error: ${error.message}`)
    );
    page.on("response", (response) => {
      if (!response.ok())
        console.error(`HTTP Error: ${response.status()} on ${response.url()}`);
    });
  });

  afterEach(async () => {
    await page.close();
  });

  it("should allow a user to register", async () => {
    await page.goto("http://localhost:8083/register");
    await page.type("input[name='name']", "Test User");
    await page.type("input[name='email']", "testuser6@ntnu.no");
    await page.type("input[name='password']", "TestP@ssword123!");
    await page.click("button[type='submit']");
    await page.waitForSelector(".Toastify__toast-body", {
      visible: true,
      timeout: 60000,
    });

    const url = await page.url();
    assert.strictEqual(
      url,
      "http://localhost:8083/login",
      "Should navigate to login after registration"
    );
  });

  it("should allow a user to log in and navigate to the dashboard", async () => {
    await page.goto("http://localhost:8083/login");
    await page.type("#email", "testuser6@ntnu.no");
    await page.type("#password", "TestP@ssword123!");
    await page.click("#login-button");
    await page.waitForSelector("#logout-button", {
      visible: true,
      timeout: 60000,
    });

    const url = await page.url();
    assert.strictEqual(
      url,
      "http://localhost:8083/dashboard",
      "Should navigate to the dashboard after login"
    );
    const logoutButtonVisible = await page.evaluate(
      () => document.querySelector("#logout-button").offsetParent !== null
    );
    assert.ok(
      logoutButtonVisible,
      "Logout button should be visible after login"
    );
  });
});

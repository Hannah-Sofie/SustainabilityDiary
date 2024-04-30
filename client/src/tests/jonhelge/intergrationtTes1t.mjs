import puppeteer from "puppeteer";

(async () => {
  // Initialize the browser and create a new page
  const browser = await puppeteer.launch({ headless: false, slowMo: 20 });
  const page = await browser.newPage();

  // Set screen size to ensure consistent layout across tests
  await page.setViewport({ width: 1440, height: 1000 });

  // Navigate to the login page
  await page.goto("http://localhost:8083/login");

  // Perform login by typing credentials and submitting the form
  await page.type("#email", "jonhsk@ntnu.no");
  await page.type("#password", "Jonhels1!");
  console.log("Typing credentials done");

  // Perform the click on the submit button and wait for navigation to complete
  await Promise.all([
    page.waitForNavigation(), // Waits for the next page to load after the button click
    page.click('[type="submit"]'), // Clicks the login button
  ]);
  console.log("Login done");

  // Function to navigate to different pages by their path
  const navigateTo = async (path) => {
    await Promise.all([
      page.waitForNavigation(), // Waits for the navigation to finish
      page.click(`a[href="${path}"]`), // Clicks the link that matches the given path
    ]);
  };
  console.log("Navigating to different pages");

  // Navigate through different sections using a function to simplify the code
  await navigateTo("/profile");
  console.log("Navigating to profile done");
  await navigateTo("/students");
  console.log("Navigating to students done");
  await navigateTo("/dashboard");
  console.log("Navigating to dashboard done");

  console.log("Test completed");
  await browser.close();
})();

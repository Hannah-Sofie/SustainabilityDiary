module.exports = {
  testEnvironment: "node",
  testMatch: [
    "**/test/**/*.js", // This pattern matches any JavaScript file inside any subdirectory under the test folder
  ],
  coveragePathIgnorePatterns: ["/node_modules/"],
};

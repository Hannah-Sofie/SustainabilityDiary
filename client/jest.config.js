module.exports = {
  setupFilesAfterEnv: ["@testing-library/jest-dom"],

  testMatch: ["**/src/tests/**/?(*.)+(spec|test).[tj]s?(x)"],

  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
    "\\.(png|jpg|jpeg|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js", // Mock static file imports
  },
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.jsx?$": "babel-jest", // Add this line to handle .js and .jsx files
  },
};

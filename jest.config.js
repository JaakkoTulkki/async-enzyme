module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    "^.+\\.jsx?$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.tsx?$": "ts-jest"
  },
  preset: 'ts-jest',
  "setupTestFrameworkScriptFile": "./enzyme.adapter.js",
  "collectCoverageFrom": [
    "src/**/*.js"
  ],
  "coveragePathIgnorePatterns": [
    "src/test.component.jsx"
  ],
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node",
  ],
};
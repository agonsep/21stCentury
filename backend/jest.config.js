module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  collectCoverageFrom: [
    'server.js',
    'database.js',
    '**/*.js',
    '!**/*.test.js',
    '!**/node_modules/**',
    '!**/coverage/**'
  ],
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  verbose: true
};
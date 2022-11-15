/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  verbose: true,
  bail: true,
  testEnvironment: 'node',
  reporters: ['default', 'github-actions'],
  collectCoverage: true,
  collectCoverageFrom: ['src/api/**/*.ts'],
  modulePathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/dist/'],
  projects: [
    {
      displayName: 'server',
      preset: 'ts-jest',
      testMatch: ['<rootDir>/tests/**/*.test.ts'],
    },
  ],
}

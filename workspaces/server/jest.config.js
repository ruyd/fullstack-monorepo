/* eslint-disable @typescript-eslint/no-unused-vars */
const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig.json')

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
  roots: ['<rootDir>'],
  projects: [
    {
      displayName: 'server',
      preset: 'ts-jest',
      testMatch: ['<rootDir>/tests/**/*.test.ts'],
      // setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
      modulePaths: [compilerOptions.baseUrl],
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
    },
  ],
}

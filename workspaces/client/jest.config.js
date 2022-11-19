const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig.json')

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  verbose: true,
  bail: true,
  projects: [
    {
      displayName: 'client',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      roots: ['<rootDir>/src/'],
      testMatch: ['**/*.test.ts?(x)'],
      transformIgnorePatterns: ['<rootDir>../../node_modules', '<rootDir>/node_modules'],
      modulePaths: [compilerOptions.baseUrl],
      moduleNameMapper: {
        uuid: require.resolve('uuid'), // ???
        ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
      },
      setupFiles: ['jest-environment-jsdom'],
      setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
      transform: {
        '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': '<rootDir>/config/jest/babelTransform.js',
        '^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
        '^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)': '<rootDir>/config/jest/fileTransform.js',
      },
      transformIgnorePatterns: [
        '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
        '^.+\\.module\\.(css|sass|scss)$',
      ],
    },
  ],
}

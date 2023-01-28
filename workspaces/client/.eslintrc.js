/* eslint-disable no-undef */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'eslint-plugin-import'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
  ],
  ignorePatterns: ['build', 'node_modules', '*.js'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'no-console': 'error',
    'import/no-named-as-default': 'off',
  },
  settings: {
    'import/resolver': {
      node: true,
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
}

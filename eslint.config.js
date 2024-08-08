export default {
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    indent: ['error', 2],
    quotes: ['error', 'single'],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        // TypeScript-specific rules my rules
        indent: ['error', 2], // Enforce consistent indentation with 2 spaces
        quotes: ['error', 'single'], // Enforce single quotes
        semi: ['error', 'always'], // Require semicolons
      },
    },
  ],
};

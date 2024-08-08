export default [
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    rules: {
      indent: ['error', 2], // Enforce consistent indentation with 2 spaces
      quotes: ['error', 'single'],  // Enforce single quotes
      semi: ['error', 'always'], // Require semicolons
    },
  },
];

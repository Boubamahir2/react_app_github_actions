export default [
  {
    files: ['**/*.js', '**/*.cjs'],
    rules: {
      semi: 'error',
      'no-unused-vars': 'error',
    },
  },
  {
    files: ['**/*.js'],
    rules: {
      'no-undef': 'error',
      semi: 'warn',
    },
  },
];

// .eslintrc.js
module.exports = {
  overrides: [
    {
      files: ['src/**/*.{js,jsx,ts,tsx}'], // Apply to all JS/TS files in the src directory
      rules: {
        semi: ['warn', 'always'], // Enforce semicolons
      },
    },
    {
      files: ['test/**/*.{js,jsx,ts,tsx}'], // Apply to all JS/TS files in the test directory
      rules: {
        'no-console': 'off', // Allow console statements in tests
      },
    },
  ],
};

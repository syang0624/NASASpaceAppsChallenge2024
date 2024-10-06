module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended', // Integrate Prettier with ESLint
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', 'react-hooks', 'jsx-a11y'],
  rules: {
    'react/react-in-jsx-scope': 'off', // React 17+ doesn't require React in scope
    'react/prop-types': 'off', // Disable prop-types rule (especially if not using PropTypes)
    'jsx-a11y/no-noninteractive-element-interactions': 'off', // Allow button interactions in JSX
    'react/jsx-props-no-spreading': 'off', // Allow spreading of props (if applicable)
    'no-unused-vars': 'warn', // Warn on unused variables but don’t block code
    'no-console': 'off', // Allow console logging (optional)
    'no-debugger': 'off', // Allow debugger statements (optional)
    'prettier/prettier': ['error', { singleQuote: true, printWidth: 80 }], // Prettier config
  },
  settings: {
    react: {
      version: 'detect', // Automatically detect React version
    },
  },
};

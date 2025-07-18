const js = require('@eslint/js');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        __DEV__: 'readonly',
        console: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      '@typescript-eslint': typescriptPlugin,
    },
    rules: {
      // React 기본 규칙
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      
      // React Hooks 규칙
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      
      // TypeScript 규칙
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-unused-vars': 'off',
      
      // 기본 JavaScript 규칙
      'no-console': 'off',
      'no-undef': 'error',
      'no-useless-catch': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
    },
    settings: {
      react: { version: 'detect' },
    },
  },
  {
    ignores: [
      'node_modules/**',
      '.expo/**',
      'dist/**',
      'build/**',
    ],
  },
];
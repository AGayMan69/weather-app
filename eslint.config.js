// eslint.config.js (Root Project Directory)

import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import path from 'node:path'; // Needed for path manipulation
import { fileURLToPath } from 'node:url'; // Needed for __dirname equivalent

// Define __dirname for ES Modules if needed (or adjust paths manually)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  // 1. Global Ignores
  { ignores: ['dist', 'functions/node_modules'] }, // Ignore dist and functions node_modules

  // 2. Configuration for React Frontend Code (excluding functions)
  {
    files: ['src/**/*.{js,jsx}'], // Target only files in src
    languageOptions: {
      ecmaVersion: 2020, // Or latest
      globals: {
         ...globals.browser, // Use browser globals
         // Add any other specific globals if needed for React/Vite
         // e.g., 'process': 'readonly' if using process.env via Vite
      },
      parserOptions: {
        ecmaVersion: 2020,
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },

  // 3. Configuration specifically for Firebase Functions Code
  {
     files: ['functions/**/*.js'], // Target only files in functions
     languageOptions: {
        ecmaVersion: 2020, // Supports async/await
        globals: {
            ...globals.node, // Use Node.js globals
            ...globals.es2017 // Or higher if needed
            // Remove browser globals here
        },
        // No JSX features needed here
        parserOptions: {
            ecmaVersion: 2020,
            sourceType: 'commonjs', // Firebase functions typically use CommonJS (require/module.exports)
        },
     },
     // Use plugins/rules relevant for Node.js, NOT React
     plugins: {
         // Add any Node-specific plugins if desired
     },
     rules: {
        ...js.configs.recommended.rules, // Basic recommendations
         // Add/override Node-specific rules
         "no-unused-vars": "warn", // Example: Warn instead of error
         "quotes": ["error", "double"],
         // Add rules from eslint-plugin-node if installed
     }
  }
];

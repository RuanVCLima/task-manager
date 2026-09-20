import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig({
  ignores: [
    'node_modules/',
    'generated/',
    '.agents/',
    '.claude/',
    '.windsurf/',
    'dist/',
  ],

  files: ['**/*.{js,ts}'],

  extends: [js.configs.recommended, tseslint.configs.recommended],

  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
});

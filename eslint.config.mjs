import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

export default defineConfig(
  { ignores: ['dist/**', '.astro/**', '.route-fixture-*/**', 'node_modules/**'] },
  {
    files: ['**/*.{js,mjs,ts}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
  ...astro.configs.recommended,
  {
    files: ['**/*.astro'],
    plugins: { '@typescript-eslint': tseslint.plugin },
    rules: { '@typescript-eslint/no-explicit-any': 'error' },
    languageOptions: { parserOptions: { parser: tseslint.parser }, globals: globals.browser },
  },
  {
    files: ['src/**/*.ts', 'src/**/*.astro'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'astro:content',
              importNames: ['getCollection'],
              message: 'Load collections in src/lib/content.ts; pass data into components.',
            },
          ],
        },
      ],
    },
  },
  { files: ['src/lib/content.ts'], rules: { 'no-restricted-imports': 'off' } },
  // astro check owns unused TypeScript declarations and framework ambient types.
  { files: ['**/*.ts'], rules: { 'no-undef': 'off' } },
);

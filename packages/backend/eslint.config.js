import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig([
  {
    name: 'backend/ignores',
    ignores: [
      'dist/**',
      'node_modules/**',
      'eslint.config.js',
      'drizzle.config.ts',
      'vite.config.ts',
    ],
  },

  ...tseslint.configs.recommended,

  {
    name: 'backend/typescript-node',
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
])

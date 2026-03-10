import { defineConfig } from 'eslint/config' // The new official helper
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import prettierConfig from 'eslint-config-prettier'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig([
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'eslint.config.js',
      'vite.config.ts',
      'vitest.setup.ts',
      'tsconfig.json',
    ],
  },

  ...pluginVue.configs['flat/recommended'],
  ...tseslint.configs.recommended,

  {
    name: 'app/vue-typescript',
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'vue/multi-word-component-names': 'off',
    },
  },

  prettierConfig,
])

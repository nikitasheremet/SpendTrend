import tseslint from 'typescript-eslint'

export default tseslint.config({
  // This root config tells ESLint to ignore everything by default
  // and let the package-specific configs handle their own folders.
  ignores: ['packages/**'],
})

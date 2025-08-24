import tseslint from 'typescript-eslint'

export default tseslint.config({
  files: ['**/*.ts'],
  languageOptions: { parser: tseslint.parser },
  rules: {
    // your TS/Node rules
  },
})

import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  vue: true,
  rules: {
    'vue/no-setup-props-reactivity-loss': 'error',
  },
  ignores: [
    '.cursor',
    '.cursor/**/*',
    '**/*.md',
  ],
})

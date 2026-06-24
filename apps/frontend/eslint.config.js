import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  vue: true,
  rules: {
    'vue/no-setup-props-reactivity-loss': 'error',
    'style/member-delimiter-style': ['error', {
      multiline: { delimiter: 'semi', requireLast: true },
      singleline: { delimiter: 'semi', requireLast: false },
    }],
  },
  ignores: [
    '.cursor',
    '.cursor/**/*',
    '**/*.md',
    'src/shared/generated',
    'node_modules',
    'dist',
    'build',
    '.cache',
    '.output',
    '.next',
    '*.min.js',
    'coverage',
  ],
})

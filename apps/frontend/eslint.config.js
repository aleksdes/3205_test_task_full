import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  vue: true,
  rules: {
    'vue/no-setup-props-reactivity-loss': 'error',
    'antfu/if-newline': 'off',
    'style/operator-linebreak': ['error', 'after'],
    'style/member-delimiter-style': 'off',
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

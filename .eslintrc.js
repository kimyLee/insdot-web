module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript/recommended',
    'plugin:vue/vue3-recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': 'warn',
    camelcase: 'off',
    'vue/html-closing-bracket-newline': [
      'warn',
      {
        multiline: 'never',
      },
    ],
    'vue/max-attributes-per-line': [
      'warn',
      {
        multiline: {
          allowFirstLine: true,
        },
      },
    ],
    'vue/html-self-closing': [
      'warn',
      {
        html: {
          void: 'always',
        },
      },
    ],
    'comma-dangle': ['error', 'always-multiline'],
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-explicit-any': 0,
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
}

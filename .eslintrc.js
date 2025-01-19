// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    // Parser that checks the content of the <script> tag
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    'browser': true,
    'node': true,
    'vue/setup-compiler-macros': true,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    // Airbnb JavaScript Style Guide https://github.com/airbnb/javascript
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
  ],
  settings: {
    'import/resolver': {
      typescript: {
        project: path.resolve(__dirname, './tsconfig.json'),
      },
    },
  },
  rules: {
    'prettier/prettier': 1,
    // Vue: Recommended rules to be closed or modify
    'vue/require-default-prop': 0,
    'vue/singleline-html-element-content-newline': 0,
    'vue/max-attributes-per-line': 0,
      "no-console": "off",
      "no-debugger": "off",
      "@typescript-eslint/no-explicit-any": ["off"],
      "@typescript-eslint/no-var-requires": 0,
    // Vue: Add extra rules
    'vue/custom-event-name-casing': [2, 'camelCase'],
    'vue/no-v-text': 1,
    "no-shadow": "off",
    "no-underscore-dangle": 0,
      "no-use-before-define": 0,
      "vue/no-mutating-props": 0,
      "no-restricted-globals": 0,
      "spaced-comment": 0,
      "array-callback-return": 0,
      "camelcase": 0,
      "object-shorthand": 0,
      "prefer-template": 0,
      "no-useless-return": 0,
      "no-plusplus": 0,
      "no-unused-expressions": 0,
      "no-prototype-builtins": 0,
      "no-lonely-if": 0,
      "no-bitwise": 0,
      "no-continue": 0,
      "no-new-func": 0,
      "guard-for-in": 0,
      "consistent-return": 0,
      "no-restricted-syntax": 0,
    'vue/padding-line-between-blocks': 1,
    'vue/require-direct-export': 1,
      'vue/no-parsing-error': 0,
    'vue/multi-word-component-names': 0,
    // Allow @ts-ignore comment
    '@typescript-eslint/ban-ts-comment': 0,
      'import/no-unresolved': 0,
      'max-classes-per-file': 0,
      'no-template-curly-in-string': 0,
      'no-else-return': 0,
    '@typescript-eslint/no-unused-vars': 1,
    '@typescript-eslint/no-empty-function': 1,
    'import/extensions': [
      2,
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'no-param-reassign': 0,
    'prefer-regex-literals': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-cycle': [0,{ ignoreExternal:true}],
  },
};

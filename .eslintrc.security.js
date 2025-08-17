const { FlatCompat } = require('@eslint/eslintrc')
const compat = new FlatCompat()

module.exports = [
  ...compat.extends(
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:sonarjs/recommended',
    'plugin:security/recommended'
  ),
  {
    rules: {
    // Security rules
    'security/detect-object-injection': 'error',
    'security/detect-non-literal-regexp': 'error',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'error',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-pseudoRandomBytes': 'error',
    
    // SonarJS code quality rules
    'sonarjs/cognitive-complexity': ['error', 15],
    'sonarjs/no-duplicate-string': ['error', 3],
    'sonarjs/no-identical-functions': 'error',
    'sonarjs/no-redundant-jump': 'error',
    'sonarjs/no-unused-collection': 'error',
    'sonarjs/prefer-immediate-return': 'error',
    'sonarjs/prefer-object-literal': 'error',
    'sonarjs/prefer-single-boolean-return': 'error',
    'sonarjs/no-small-switch': 'error',
    'sonarjs/no-duplicated-branches': 'error',
    'sonarjs/no-identical-expressions': 'error',
    
    // TypeScript security rules
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-call': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',
    
    // General security best practices
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    'no-proto': 'error',
    'no-iterator': 'error',
    'no-restricted-globals': ['error', 'event', 'fdescribe'],
    'no-restricted-syntax': [
      'error',
      {
        selector: "CallExpression[callee.name='setTimeout'][arguments.length!=2]",
        message: 'setTimeout must always be invoked with two arguments.'
      }
    ]
  },
      },
    overrides: [
      {
        files: ['**/*.test.{js,jsx,ts,tsx}', '**/__tests__/**/*'],
        rules: {
          'sonarjs/no-duplicate-string': 'off',
          '@typescript-eslint/no-explicit-any': 'off'
        }
      }
    ]
  }
] 
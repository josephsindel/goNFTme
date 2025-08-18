import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import sonarjs from 'eslint-plugin-sonarjs'
import security from 'eslint-plugin-security'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: [
      '.next/**',
      'node_modules/**',
      'build/**',
      'reports/**',
      '**/*.d.ts',
      '**/webpack.*.js',
      '**/*.hot-update.js',
      '**/main-app.js',
      '**/_buildManifest.js',
      '**/_ssgManifest.js'
    ],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        global: 'readonly',
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'sonarjs': sonarjs,
      'security': security
    },
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
      'sonarjs/no-duplicate-string': ['error', { threshold: 3 }],
      'sonarjs/no-identical-functions': 'error',
      'sonarjs/no-redundant-jump': 'error',
      'sonarjs/no-unused-collection': 'error',
      'sonarjs/prefer-immediate-return': 'error',
      'sonarjs/prefer-object-literal': 'error',
      'sonarjs/prefer-single-boolean-return': 'error',
      'sonarjs/no-small-switch': 'error',
      'sonarjs/no-duplicated-branches': 'error',
      'sonarjs/no-identical-expressions': 'error',
      
      // General security best practices
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      'no-proto': 'error',
      'no-iterator': 'error',
      'no-restricted-globals': ['error', 'event', 'fdescribe'],
    }
  },
  {
    files: ['**/*.test.{js,jsx,ts,tsx}', '**/__tests__/**/*'],
    rules: {
      'sonarjs/no-duplicate-string': 'off',
      'security/detect-object-injection': 'off'
    }
  }
] 
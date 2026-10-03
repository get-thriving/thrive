/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  env: { browser: true, node: true, es2020: true },

  // Put only generic, cross-file config here (no React)
  overrides: [
    // JS/TS (non-TOML) — apply React + TS rules here
    {
      files: ['**/*.{ts,tsx,js,jsx}'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y', 'import'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'prettier',
      ],
      rules: {
        'react/react-in-jsx-scope': 'off',
        'react/jsx-uses-react': 'off',
        'import/order': ['warn', {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          'newlines-between': 'always',
        }],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        // New in eslint-plugin-react-hooks 7. They flag existing effect and
        // memo patterns; the classic rules-of-hooks and exhaustive-deps stay on.
        'react-hooks/set-state-in-effect': 'off',
        'react-hooks/refs': 'off',
        'react-hooks/preserve-manual-memoization': 'off',
        'no-restricted-imports': ['error', { patterns: ['.*'] }],
      },
      settings: {
        // Only evaluated for JS/TS files, so no warning when linting TOML
        react: { version: 'detect' },
      },
    },

    // One tsconfig per package. The import resolver warns, and does extra
    // lookups, when `project` lists more than one — and each package is linted
    // on its own, with its own path mappings.
    {
      files: ['src/webui/**/*.{ts,tsx}'],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['src/webui/tsconfig.json'],
      },
      settings: {
        'import/resolver': {
          typescript: {
            project: 'src/webui/tsconfig.json',
          },
        },
      },
    },
    {
      files: ['src/published/**/*.{ts,tsx}'],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['src/published/tsconfig.json'],
      },
      settings: {
        'import/resolver': {
          typescript: {
            project: 'src/published/tsconfig.json',
          },
        },
      },
    },
    {
      files: ['src/core/**/*.{ts,tsx}'],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['src/core/tsconfig.json'],
      },
      settings: {
        'import/resolver': {
          typescript: {
            project: 'src/core/tsconfig.json',
          },
        },
      },
    },

    // TOML — isolate TOML linting so it doesn't load React at all
    {
      files: ['**/*.toml'],
      parser: 'toml-eslint-parser',
      plugins: ['toml'],
      extends: ['plugin:toml/recommended'],
    },
  ],
};

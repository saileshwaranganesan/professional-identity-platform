import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Ignore build output and dependencies
  globalIgnores(['dist', 'node_modules']),

  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      // recommendedTypeChecked enables rules that require type information.
      // These catch real bugs: awaiting non-Promises, unsafe any usage, etc.
      ...tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      // prettier must be last — disables all ESLint formatting rules that
      // would conflict with Prettier's output.
      prettier,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        // Required for type-aware lint rules.
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Enforce `import type` for type-only imports.
      // Works in tandem with verbatimModuleSyntax in tsconfig.
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
    },
  },
])

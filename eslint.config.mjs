import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
  // { files: ["**/*.{js,mjs,cjs,ts}" ]},
  {
    files: ['**/*.ts'],
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'prettier/prettier': [
        'warn',
        {
          semi: true,
          tabWidth: 2,
          trailingComma: 'all',
          useTabs: false,
          singleQuote: true,
          printWidth: 120,
        },
      ],
      semi: ['warn', 'always', { omitLastInOneLineBlock: false }],
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/ban-types': [
        'error',
        {
          types: {
            Function: false,
          },
          extendDefaults: true,
        },
      ],
    },
    ignores: ['**/node_modules/', '**/dist/'],
  },
];

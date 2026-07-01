import globals from "globals";
import pluginJs from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import pluginReact from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";

export default [
  // Target File
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    ignores: [
      "**/node_modules/**",
      "packages/app/public/**",
      "dist/**",
      "build/**",
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
  },
  pluginJs.configs.recommended, // JavaScript Recommend Rules
  pluginReact.configs.flat.recommended, // React Recommend Rule
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      "react/react-in-jsx-scope": "off", // In Next.js, Unnecessary React import
      "import/no-extraneous-dependencies": "off", // Set Off Extraneous dependencies warning
      "react/jsx-filename-extension": [
        "warn",
        { extensions: [".tsx", ".jsx"] },
      ], // Allow JSX extension
      "no-unused-vars": "off",
      "no-undef": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }], // console.log warning
      "react/prop-types": "off",
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
          ],
          pathGroups: [
            // 1. React
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
            {
              pattern: "react-dom",
              group: "external",
              position: "before",
            },

            // 2. Next.js
            {
              pattern: "next",
              group: "external",
              position: "after",
            },
            {
              pattern: "next/**",
              group: "external",
              position: "after",
            },

            // 4. UI components
            {
              pattern: "app/shared/ui",
              group: "internal",
              position: "after",
            },

            // 5. Internal components
            {
              pattern: "app/features/library/ui",
              group: "internal",
              position: "after",
            },

            // 6. Utilities/helpers
            {
              pattern: "app/shared/**",
              group: "internal",
              position: "after",
            },

            // 7. Types
            {
              pattern: "@/types/**",
              group: "internal",
              position: "after",
            },
          ],
        },
      ],
    },
  },
];

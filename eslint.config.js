import reactPlugin from "eslint-plugin-react";

export default [
  {
    files: ["src/**/*.{js,jsx}"],
    plugins: {
      react: reactPlugin,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
        fetch: "readonly",
        Response: "readonly",
        Blob: "readonly",
        URL: "readonly",
        Image: "readonly",
        Event: "readonly",
        CustomEvent: "readonly",
        KeyboardEvent: "readonly",
        HTMLElement: "readonly",
        HTMLInputElement: "readonly",
        HTMLTextAreaElement: "readonly",
        HTMLSelectElement: "readonly",
        HTMLCanvasElement: "readonly",
        ResizeObserver: "readonly",
        IntersectionObserver: "readonly",
        FormData: "readonly",
        alert: "readonly",
        process: "readonly",
        module: "readonly",
        require: "readonly",
        __dirname: "readonly",
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-undef": "warn",
    },
  },
  {
    ignores: ["dist/**", "node_modules/**", "coverage/**", "**/*.min.js"],
  },
];

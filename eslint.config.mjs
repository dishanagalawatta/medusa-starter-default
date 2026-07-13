import js from "@eslint/js";

export default [
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "node_modules_backup/**",
      ".medusa/**"
    ]
  },
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        require: "readonly",
        module: "readonly",
        process: "readonly",
        console: "readonly",
        __dirname: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "off"
    }
  }
];



/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@repo/eslint-config/next.js"],
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  parserOptions: {
    project: true,
  },
  rules: {
    "no-undef": "off",
    "no-unused-vars": "off",
  },
};

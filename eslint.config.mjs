import jsonc from "eslint-plugin-jsonc";

export default [
  ...jsonc.configs["recommended-with-json"],
  {
    ignores: ["**/node_modules/**", "posts/**"],
    files: ["**/*.json"]
  }
];

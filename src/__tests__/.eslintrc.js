/** @type {import('@types/eslint').Linter.Config} */
module.exports = {
  rules: {
    "@typescript-eslint/no-unused-vars": "off",
  },
  env: {
    "jest/globals": true,
  },
}

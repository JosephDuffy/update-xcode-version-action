/** @type {import('@types/eslint').Linter.Config} */
module.exports = {
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "no-return-await": "off",
  },
  env: {
    "jest/globals": true,
  },
}

module.exports = {
  env: {
    browser: true,
    es6: true,
    // "jest/globals": true, // code formatが機能しなくなったためコメントアウト
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    // "prettier/react",
  ],
  plugins: ["react", "prettier"],
  parser: "babel-eslint",
  parserOptions: {
    version: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "react/prop-types": "off",
  },
};

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: 'airbnb-base',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "linebreak-style": 0,
    "no-unused-vars": 0,
    "no-console": 0,
    "no-undef": 0,
    "no-shadow": 0,
    "import/no-extraneous-dependencies":0,
    "class-methods-use-this": 0,
    "max-len": 0,
    "consistent-return": 0,
    "import/prefer-default-export": 0,
    "radix":0,
    "no-dupe-keys": 0,
    "no-plusplus": 0,
    "import/no-mutable-exports": 0,
  },
};

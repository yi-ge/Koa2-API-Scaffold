module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 8, //指定ECMAScript支持的版本，6为ES6，这里为了兼容async和await，设置为8
    sourceType: 'module'
  },
  extends: 'standard',
  plugins: [
    'html',
    'promise'
  ],
  env: {
        'node': true
  },
  rules: {
    // allow console
    'no-console': 0,
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': 0
  }
}

module.exports = {
  "plugins": ["stylelint-less"],
  "rules": {
    "indentation": 4,
    // 禁止无效的 16 进制颜色。
    "color-no-invalid-hex": true,
    // 颜色指定大写
    "color-hex-case": "upper",
    // 禁止未知的单位。
    "unit-no-unknown": true,
    // 禁止未知的属性
    "property-no-unknown": true,
    // 禁止空块
    'block-no-empty': true,
    // 兼容自定义标签名
    "selector-type-no-unknown": [true, {
      "ignoreTypes": ['/^page/']
    }],
    // 禁止低优先级的选择器出现在高优先级的选择器之后。
    "no-descending-specificity": null,
    // 不验证@未知的名字
    "at-rule-no-unknown": null,
    // 禁止空注释
    "comment-no-empty": true,
    // 禁止简写属性的冗余值
    "shorthand-property-no-redundant-values": true,
    // 禁止值的浏览器引擎前缀
    "value-no-vendor-prefix": true,
    // 禁止属性的浏览器引擎前缀。
    "property-no-vendor-prefix": true,
    // 禁止小于 1 的小数有一个前导零
    "number-leading-zero": "never",
    // 禁止空第一行
    "no-empty-first-line": true,
    "function-url-quotes": "always",
    // 要求或禁止声明块的一个尾随分号。
    "declaration-block-trailing-semicolon": "always",
    // 要求在选择器列表的逗号之后必须有换行符
    "selector-list-comma-newline-after": "always",
    // 要求在声明块的冒号之后必须有一个空格或不能有空白符。
    "declaration-colon-space-after": "always",
    "function-calc-no-unspaced-operator": true,
  },
  "customSyntax": "postcss-less",
}
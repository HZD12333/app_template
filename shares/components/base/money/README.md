# 金额显示组件

## 基础用法

```js
<Money value={99.9} />
```

## 设置样式

```js
<Money 
  value={199.9}
  sizes={[16, 12]} // [金额大小, ¥符号大小]
  color="#FF4D4F"
/>
```

## 可用属性
- `value?: string | number` - 要显示的金额值
- `sizes?: number[]` - 字体大小数组[金额大小, ¥符号大小]
- `color?: string` - 金额文字颜色
- `className?: string` - 自定义样式类名
- `style?: React.CSSProperties` - 自定义内联样式

## 注意事项
- 自动显示¥符号
- 值为空时不渲染
- 支持数字和字符串格式

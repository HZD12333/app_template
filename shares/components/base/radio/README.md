# 单选按钮组件

## 基础用法

```js
<Radio checked={true} />
```

## 带标签的单选

```js
<Radio checked={selected === 'option1'} onChange={(checked) => setSelected(checked ? 'option1' : '')}>
  选项1
</Radio>
```

## 不可点击状态

```js
<Radio 
  checked={true}
  clickable={false}
  onClick={() => alert('已选中')}
/>
```

## 可用属性
- `checked?: boolean` (默认false) - 是否选中
- `onChange?: (value: boolean) => void` - 状态变化回调
- `onClick?: (e?: Event) => void` - 点击回调
- `clickable?: boolean` (默认true) - 是否可点击切换状态
- `className?: string` - 自定义样式类名
- `style?: React.CSSProperties` - 自定义内联样式

## 注意事项
- 支持单独使用或带标签
- 可配置为不可切换状态
- 点击事件会自动阻止冒泡

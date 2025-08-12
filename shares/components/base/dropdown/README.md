# 下拉菜单组件

## 基础用法

```js
<Dropdown content={<Menu>...</Menu>}>
  <Button>打开菜单</Button>
</Dropdown>
```

## 可用属性
- `content`: React.ReactNode (必填) - 下拉菜单内容
- `onVisibleChange?: (visible: boolean) => void` - 显示状态变化回调
- `targetId?: string` - 指定目标容器ID
- `maskClosable?: boolean` (默认true) - 点击遮罩是否关闭
- `className?: string` - 自定义样式类名
- `style?: React.CSSProperties` - 自定义内联样式

## 注意事项
- 继承自Popover组件的所有功能
- 内容区域需要自行实现滚动控制

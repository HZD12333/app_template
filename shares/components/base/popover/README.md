# 弹出层组件

## 基础用法

```js
<Popover content={<div>弹出内容</div>}>
  <Button>点击弹出</Button>
</Popover>
```

## 控制显示

```js
const popoverRef = useRef<PopoverRef>(null);

<Popover 
  ref={popoverRef}
  content={<Menu>...</Menu>}
  onVisibleChange={(visible) => console.log(visible)}
>
  <Button>控制弹出</Button>
</Popover>

// 手动控制
popoverRef.current?.show();
popoverRef.current?.hide();
```

## 高级配置

```js
<Popover
  content={<Tooltip>提示内容</Tooltip>}
  targetId="scroll-container" 
  maskClosable={false}
  className="custom-popover"
>
  <Icon type="help" />
</Popover>
```

## 可用属性
- `content: React.ReactNode` (必填) - 弹出内容
- `onVisibleChange?: (visible: boolean) => void` - 显示状态变化回调
- `targetId?: string` - 指定目标容器ID
- `maskClosable?: boolean` (默认true) - 点击遮罩是否关闭
- `className?: string` - 自定义样式类名
- `style?: React.CSSProperties` - 自定义内联样式

## 注意事项
- 提供ref控制显示/隐藏
- 支持嵌套使用
- 自动处理滚动容器

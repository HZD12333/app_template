# 懒加载组件

## 基础用法

```js
<LazyLoad>
  <HeavyComponent />
</LazyLoad>
```

## 设置触发阈值

```js
<LazyLoad threshold={0.5}>
  <Image src="large-image.jpg" />
</LazyLoad>
```

## 调整加载边界

```js
<LazyLoad rootMargin="200px">
  <SectionComponent />
</LazyLoad>
```

## 可用属性
- `threshold?: number` - 触发加载的可见比例阈值(0-1)
- `rootMargin?: string` - 根元素的边界margin(如"200px"或"20%")
- `className?: string` - 自定义样式类名
- `style?: React.CSSProperties` - 自定义内联样式

## 注意事项
- 内部使用react-intersection-observer实现
- 默认只触发一次加载
- 适用于图片、组件等需要懒加载的内容

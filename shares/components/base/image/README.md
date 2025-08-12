# 图片组件

## 基础用法

```js
<Image src="path/to/image.jpg" />
```

## 设置尺寸

```js
<Image 
  src="path/to/image.jpg"
  width={200}
  height={150}
/>
```

## 图片样式

```js
<Image
  src="path/to/image.jpg"
  borderRadius={8}
  objectFit="cover"
/>
```

## 高级功能

```js
<Image
  src="path/to/image.jpg"
  hideSkeleton // 禁用加载动画
  loading="eager" // 预加载
  alt="描述文字"
/>
```

## 可用属性
- `width?: number` - 宽度(px)
- `height?: number` - 高度(px) 
- `borderRadius?: number` - 圆角(px)
- `objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'` (默认'contain')
- `hideSkeleton?: boolean` - 是否禁用加载动画
- 支持所有标准img属性(src, alt, loading等)

# 空状态组件

## 基础用法

```js
<NoData />
```

## 不同类型

```js
<NoData type={eNoDataType.Search} />
<NoData type={eNoDataType.Order} />
```

## 自定义内容

```js
<NoData 
  text={<span>暂无搜索结果<br/>换个关键词试试</span>}
  iconUrl="custom-image.png"
  size="small"
/>
```

## 可用属性
- `text?: React.ReactNode | string` (默认"暂无数据～") - 提示文字
- `type?: eNoDataType` (默认Normal) - 数据类型:
  - `eNoDataType.Normal`: 默认空状态
  - `eNoDataType.Search`: 搜索无结果
  - `eNoDataType.Order`: 订单为空
- `iconUrl?: string` - 自定义图标URL
- `size?: 'small' | 'default'` (默认'default') - 图标大小
- `className?: string` - 自定义样式类名
- `style?: React.CSSProperties` - 自定义内联样式

## 注意事项
- 内置三种默认图标
- 支持完全自定义图标
- 文字内容支持React节点

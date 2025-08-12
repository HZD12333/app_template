# 滚动列表组件

## 基础用法

```js
<ScrollList
  items={data}
  itemRender={(item) => <ListItem data={item} />}
  onEndReached={loadMore}
/>
```

## 自定义空状态

```js
<ScrollList
  items={[]}
  itemRender={() => null}
  noData={<Empty description="暂无数据" />}
  noDataProps={{ type: eNoDataType.Order }}
/>
```

## 高级配置

```js
<ScrollList
  items={products}
  itemRender={(product) => <ProductCard {...product} />}
  hasNext={hasMore}
  loading={isLoading}
  targetId="product-list"
  bufferDistance={50}
  onScroll={(scrollTop) => trackScroll(scrollTop)}
  onEndReached={fetchNextPage}
  showBackTop={false}
  className="custom-list"
/>
```

## 可用属性
- `items: T[]` - 列表数据数组
- `itemRender: (item: T, index?: number) => React.ReactNode` - 列表项渲染函数
- `noData?: React.ReactNode` - 自定义空状态组件
- `noDataProps?: INoDataProps` - 空状态组件props
- `hasNext?: boolean` - 是否有下一页数据
- `loading?: boolean` - 是否正在加载
- `textColor?: string` - 加载状态文字颜色
- `showBackTop?: boolean` (默认true) - 是否显示返回顶部按钮
- `targetId?: string` (默认'root') - 滚动容器元素ID
- `bufferDistance?: number` (默认20) - 触发加载的滚动距离阈值(px)
- `onScroll?: (scrollTop: number, event?: Event) => void` - 滚动事件回调
- `onEndReached: () => void` - 触底加载回调函数
- `className?: string` - 自定义样式类名
- `style?: React.CSSProperties` - 自定义内联样式

## 注意事项
- 内置加载中和到底了状态提示
- 自动处理滚动监听和触底加载
- 支持自定义空状态和列表项渲染

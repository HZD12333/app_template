# 导航栏组件

## 基础用法

```js
<NavBar>页面标题</NavBar>
```

## 自定义左右内容

```js
<NavBar
  leftExtra={<BackButton />}
  rightExtra={<ShareButton />}
>
  商品详情
</NavBar>
```

## 主题与样式

```js
<NavBar
  theme="light"
  backgroundColor="#FFFFFF"
  position="fixed"
>
  个人中心
</NavBar>
```

## 事件处理

```js
<NavBar
  onBack={(goBack) => {
    // 自定义返回逻辑
    if(shouldGoBack) goBack();
  }}
  onRefresh={() => {
    // 自定义刷新逻辑
    reloadData();
  }}
>
  订单列表
</NavBar>
```

## 可用属性
- `leftExtra?: React.ReactNode` - 左侧额外内容
- `rightExtra?: React.ReactNode` - 右侧额外内容
- `theme?: 'light' | 'dark'` (默认'dark') - 主题颜色
- `fillStatusBar?: boolean` (默认true) - 是否填充状态栏
- `backgroundColor?: string` - 自定义背景色
- `position?: 'fixed' | 'sticky'` (默认'sticky') - 定位方式
- `flex?: boolean` - 标题是否flex布局
- `leftClassName?: string` - 左侧容器类名
- `rightClassName?: string` - 右侧容器类名
- `useReactHistory?: boolean` - 是否使用React路由历史
- 支持所有标准div属性

## 注意事项
- 默认包含返回和刷新按钮
- 自动处理状态栏高度
- 支持自定义主题和背景色

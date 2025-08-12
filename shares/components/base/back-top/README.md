# 返回顶部组件

## 基础用法

```js
<BackTop />
```

## 指定目标容器

```js
<BackTop targetId="content-container" />
```

## 自定义样式类名

```js
<BackTop className="custom-back-top" />
```

## 注意事项
- 需要确保目标容器有设置overflow和高度
- 滚动监听基于指定的targetId容器

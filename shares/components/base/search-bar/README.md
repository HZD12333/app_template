# 搜索栏组件

## 基础用法

```js
<SearchBar 
  placeholder="请输入关键词"
  onSearch={(val) => console.log(val)}
/>
```

## 实时搜索

```js
<SearchBar
  onInput={(val) => fetchSuggestions(val)}
  onSearch={(val) => doSearch(val)}
/>
```

## 通过ref控制

```js
const searchRef = useRef<SearchBarRef>(null);

// 设置搜索值
searchRef.current?.setInputValue('默认关键词');
// 获取当前值
const keyword = searchRef.current?.getInputValue();

<SearchBar ref={searchRef} />
```

## 可用属性
- `placeholder?: string` - 输入框占位文本
- `onSearch?: (val: string) => void` - 搜索回调(点击搜索按钮或按回车触发)
- `onInput?: (val: string) => void` - 输入变化回调
- `onFocus?: MouseEventHandler<HTMLInputElement>` - 输入框聚焦回调

## 注意事项
- 内置清除按钮
- 支持通过ref获取/设置输入值
- 自动处理输入trim

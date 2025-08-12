# 省市区选择器组件

## 基础用法

```js
const [region, setRegion] = useState([]);

<RegionPicker 
  defaultValue={['440000', '440300', '440305']}
  onChange={(value) => setRegion(value)}
/>
```

## 通过ref控制

```js
const pickerRef = useRef<RegionPickerRef>(null);

// 打开选择器
pickerRef.current?.open(['440000', '440300']);

<RegionPicker ref={pickerRef} />
```

## 可用属性
- `defaultValue?: string[]` - 默认选中的省市区值
- `onChange?: (value: Nullable<LabelValueOption>[]) => void` - 选择变化回调
- `className?: string` - 自定义样式类名
- `style?: React.CSSProperties` - 自定义内联样式

## 注意事项
- 基于antd-mobile的CascadePicker实现
- 自动加载最新的省市区数据
- 支持通过ref手动控制打开/关闭

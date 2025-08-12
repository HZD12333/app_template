import CascadePicker from 'antd-mobile/es/components/cascade-picker';
import React, {
    useEffect,
    useState,
    useMemo,
    useRef,
    forwardRef,
    useImperativeHandle,
    useCallback,
} from 'react';

import { readJsonConfig } from '@miyuan/helpers';
import { useMemoizedFn } from '@miyuan/hooks';
import { ComponentBaseProps, Recordable, LabelValueOption, Nullable } from '@miyuan/types';

import { DEFAULT_KEY, array2map } from './utils';

import type { CascadePickerOption } from 'antd-mobile/es/components/cascade-picker';

import './index.less';

interface RegionPickerProps extends ComponentBaseProps {
    /** 默认值 */
    defaultValue?: string[];
    /** 确认选中省市区 */
    onChange?: (value: Nullable<LabelValueOption>[]) => void;
}
export type RegionPickerRef = {
    open: (val?: Nullable<string>[]) => void;
    close: () => void;
};

const _RegionPicker = forwardRef<RegionPickerRef, RegionPickerProps>((props, ref) => {
    const { defaultValue, onChange } = props;
    const [visible, setVisible] = useState(false);
    const [valueToOptions, setValueToOptions] = useState<Recordable<CascadePickerOption[] | null>>({});
    const cacheMap = useRef<Recordable<CascadePickerOption[]>>({});

    const options = useMemo<CascadePickerOption[]>(() => {
        function generate(v: string) {
            const options = valueToOptions[v];
            if (options === null) {
                return undefined;
            }
            return options?.map((option) => ({
                ...option,
                children: generate(option.value!),
            }));
        }
        return generate(DEFAULT_KEY) ?? [];
    }, [valueToOptions]);

    const fetchOptionsForValue = useMemoizedFn((v: string, level: number) => {
        if (v in valueToOptions) return;
        if (level >= 3) {
            setValueToOptions((prev) => ({
                ...prev,
                [v]: null,
            }));
            return;
        }
        const options = cacheMap.current[v];
        setValueToOptions((prev) => ({
            ...prev,
            [v]: options,
        }));
    });

    const handleSelect = useCallback(
        (value) => {
            value.forEach((v, index) => {
                fetchOptionsForValue(v as string, index + 1);
            });
        },
        [fetchOptionsForValue],
    );

    const [value, setValue] = useState<Nullable<string>[]>(defaultValue || []);
    useImperativeHandle(ref, () => {
        return {
            open(val?: Nullable<string>[]) {
                setVisible(true);
                if (val && val.length) {
                    handleSelect(val);
                    setValue(val);
                }
            },
            close() {
                setVisible(false);
            },
        };
    });

    useEffect(() => {
        readJsonConfig('https://img.gzzhitu.com/h5-config/new-h5/area.json').then((res) => {
            cacheMap.current = array2map(res);
            fetchOptionsForValue(DEFAULT_KEY, 0);
        });
    }, []);

    return (
        <CascadePicker
            className='my-region-picker'
            value={value}
            options={options}
            visible={visible}
            onSelect={handleSelect}
            onConfirm={(value) => {
                const arr = value.map((v, index) => {
                    if (!v) return null;
                    if (index === 0) {
                        const provinces = cacheMap.current[DEFAULT_KEY];
                        return provinces.find((item) => item.value === value[0]) || null;
                    }
                    const citiesOrAreas = cacheMap.current[value[index - 1] as string];
                    return citiesOrAreas.find((item) => item.value === value[index]) || null;
                }) as Nullable<LabelValueOption>[];
                onChange?.(arr);
            }}
            onClose={() => {
                setVisible(false);
            }}
        />
    );
});

export const RegionPicker = React.memo(_RegionPicker);

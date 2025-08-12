import { Recordable } from '@miyuan/types';

import type { CascadePickerOption } from 'antd-mobile/es/components/cascade-picker';

interface IRegionItem {
    code: string;
    name: string;
    city?: IRegionItem[];
    area?: IRegionItem[];
}

export const DEFAULT_KEY = '9999999';

export const LAYER_KEYS = ['', 'city', 'area'];

export const toOptions = (data: IRegionItem[]): CascadePickerOption[] => {
    if (!data || !data.length) {
        return [];
    }
    return data.map((item) => ({
        label: item.name,
        value: item.code,
    }));
};

export const array2map = (data: IRegionItem[]): Recordable<CascadePickerOption[]> => {
    const obj = {};

    function generate(list: IRegionItem[], layer = 1) {
        if (list && list.length) {
            list.forEach((item) => {
                const children = item[LAYER_KEYS[layer]];
                if (children) {
                    obj[item.code] = toOptions(children);
                    generate(item[LAYER_KEYS[layer]], layer + 1);
                }
            });
        }
    }
    generate(data);

    return {
        ...obj,
        [DEFAULT_KEY]: toOptions(data),
    };
};

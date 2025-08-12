import React, { useState, useEffect } from 'react';

import { useMemoizedFn } from '@miyuan/hooks';

import styles from './index.module.less';

export type Categorys = {
    id: number;
    name: string;
}[];

const ORDER_TABS = [
    // 订单状态 -1全部 1-待发货 2-待收货 3-已完成 4-已关闭 5-退款/售后
    { name: '全部', id: -1 },
    { name: '待发货', id: 1 },
    { name: '待收货', id: 2 },
    { name: '退款/售后', id: 5 },
    { name: '已完成', id: 3 },
];

type ProductCategoryProps = {
    defaultActive?: number;
    onChange?: (pSt: number) => void;
};

const Tabs: React.FC<ProductCategoryProps> = (props) => {
    const { defaultActive, onChange } = props;
    const [categories] = useState<Categorys>(ORDER_TABS);
    const [activeIndex, setActiveIndex] = useState(defaultActive);

    const changeHandle = useMemoizedFn((id: number) => {
        if (onChange) onChange(id);
        setActiveIndex(id);
    });

    useEffect(() => {
        setActiveIndex(defaultActive);
    }, [defaultActive]);

    return (
        <div className={styles.inner}>
            {categories.map((item) => (
                <span
                    key={item.id}
                    onClick={() => changeHandle(item.id)}
                    className={`${styles.item} ${activeIndex === item.id ? styles.active : ''}`}
                >
                    {item.name}
                </span>
            ))}
        </div>
    );
};

export default Tabs;

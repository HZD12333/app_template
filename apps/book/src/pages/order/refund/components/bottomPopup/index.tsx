import React, { useState, useCallback, useEffect } from 'react';

import styles from './index.module.less';

export type ReasonRefundS = {
    id: number;
    name: string;
}[];

type ReasonRefundProps = {
    onConfirm: (id: number, name: string) => void;
    onCancel: () => void;
    defaultActive: number | string;
    data: ReasonRefundS;
    isApplFor?: boolean;
};

const BottomPopup: React.FC<ReasonRefundProps> = (props) => {
    const { onConfirm, onCancel, defaultActive, data, isApplFor } = props;
    const [activeIndex, setActiveIndex] = useState(1);
    const [activeName, setActiveName] = useState('不想要了');
    const changeHandle = useCallback(
        (id: number, name: string) => {
            setActiveIndex(id);
            setActiveName(name);
        },
        [activeIndex],
    );

    const confirmHandle = () => {
        onConfirm(activeIndex, activeName);
    };
    const cancelHandle = () => {
        onCancel();
    };
    useEffect(() => {
        setActiveIndex(defaultActive);
    }, [defaultActive]);

    return (
        <>
            <div className={styles.bottomMark} />
            <div className={styles.bottomPopup}>
                <div className={styles.btns}>
                    <div className={styles.cancel} onClick={() => cancelHandle()}>
                        取消
                    </div>
                    <div className={styles.complete} onClick={() => confirmHandle()}>
                        完成
                    </div>
                </div>
                <div className={`${styles.kdItem} ${isApplFor && data.length > 4 ? styles.kdItem1 : ''}`}>
                    {data.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => changeHandle(item.id, item.name)}
                            className={`${styles.item} ${activeIndex === item.id ? styles.active : ''}`}
                        >
                            {item.name}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
export default BottomPopup;

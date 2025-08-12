import classNames from 'classnames';
import React, { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';

import styles from './index.module.less';

export interface ITabItem<T> {
    label: string | React.ReactNode;
    key: T;
    children?: React.ReactNode;
    disabled?: boolean;
    icon?: React.ReactNode;
    className?: string;
}

interface IProps<T> {
    activeKey?: T;
    onChange?: (key: T, item?: ITabItem<T>, index?: number) => void;
    items: ITabItem<T>[];
    centered?: boolean;
    className?: string;
    tabBarItemRender?: (props: ITabItem<T>, index?: number) => React.ReactNode;
    activeAutoCenter?: boolean;
    indicatorColor?: string;
    indicatorStyle?: Partial<CSSProperties>;
    tarBarActiveColor?: string;
    tarBarInactiveColor?: string;
    indicatorClass?: string;
}

export function Tab<T extends number | string>(props: IProps<T>) {
    const {
        activeKey,
        onChange,
        items,
        centered,
        className,
        tabBarItemRender,
        indicatorColor,
        tarBarActiveColor,
        tarBarInactiveColor,
        activeAutoCenter,
        indicatorClass,
    } = props;
    const tabBarRef = useRef<HTMLDivElement>(null);

    const [currentIndex, setCurrentIndex] = useState(-1);

    const getTabItem = (index: number) =>
        tabBarRef.current?.querySelector<HTMLDivElement>(`.${styles.tabItem}:nth-child(${index + 1})`);

    const indicatorStyle = useMemo(() => {
        const style: Partial<CSSProperties> = {};
        if (!tabBarRef.current) {
            return style;
        }
        if (indicatorColor) {
            style.backgroundColor = indicatorColor;
        }

        const tab = getTabItem(currentIndex);
        if (tab) {
            const computedStyle = getComputedStyle(tab);
            style.left = `${tab.offsetLeft + Number.parseFloat(computedStyle.paddingLeft)}px`;
            style.width = `${Number.parseFloat(computedStyle.width)}px`;
        }
        return {
            ...style,
            ...props.indicatorStyle,
        };
    }, [currentIndex, items]);

    const renderTabBar = (index: number) => {
        if (tabBarItemRender) {
            return tabBarItemRender(items[index], index);
        }

        return items[index].label;
    };

    const updateIndex = (index: number) => {
        if (currentIndex === index) {
            return;
        }
        setCurrentIndex(index);
        const tabBarItem = getTabItem(index);
        if (tabBarItem && activeAutoCenter) {
            tabBarItem.scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest',
            });
        }
    };
    const onTabChange = (index: number) => {
        const item = items[index];

        if (item.disabled) {
            return;
        }
        setCurrentIndex(index);
        updateIndex(index);
        if (onChange) {
            onChange(item.key, item, index);
        }
    };

    const getTabItemStyle = (index: number) => {
        if (currentIndex === index && tarBarActiveColor) {
            return {
                color: tarBarActiveColor,
            };
        }
        if (tarBarInactiveColor) {
            return {
                color: tarBarInactiveColor,
            };
        }
        return {};
    };

    useEffect(() => {
        if (activeKey) {
            const index = items.findIndex((item) => item.key === activeKey);
            if (index >= 0) {
                updateIndex(index);
            }
        }
    }, [activeKey, items]);

    useEffect(() => {
        if (items.length === 0) return;

        if (activeKey) {
            const index = items.findIndex((item) => item.key === activeKey);
            if (index >= 0) {
                updateIndex(index);
            } else {
                updateIndex(0);
            }
        } else {
            updateIndex(0);
        }
    }, []);

    return (
        <div className={classNames(styles.tabs, className)}>
            <div
                ref={tabBarRef}
                className={classNames(styles.tabBar, {
                    [styles.centered]: centered,
                    [styles['no-underline']]: !items[currentIndex]?.children,
                })}
            >
                {items.map((item, index) => (
                    <div
                        key={`${item.key}_${index}`}
                        className={classNames(styles.tabItem, item.className, {
                            active: currentIndex === index,
                        })}
                        style={getTabItemStyle(index)}
                        onClick={() => onTabChange(index)}
                    >
                        {renderTabBar(index)}
                    </div>
                ))}
                <div className={classNames(styles.indicator, indicatorClass)} style={indicatorStyle} />
            </div>
            {items[currentIndex]?.children ? (
                <div className={styles.content}>{items[currentIndex]?.children}</div>
            ) : null}
        </div>
    );
}

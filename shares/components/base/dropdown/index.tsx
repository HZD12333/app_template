import classNames from 'classnames';
import React, { useRef } from 'react';

import { Popover, type PopoverRef, type PopoverProps } from '../popover';

import styles from './index.module.less';

const iconUrl = 'https://img.gzzhitu.com/zhitu-api/1722482754132.png';

export interface IDropdownOption<T = unknown> {
    label: React.ReactNode;
    value: T;
    icon?: React.ReactNode;
    onClick: (value?: T, index?: number) => void;
    itemRender?: (item?: IDropdownOption) => React.ReactNode;
}

type DropdownProps = {
    items: IDropdownOption[];
    hideArrow?: boolean;
} & Omit<PopoverProps, 'content'>;

const _Dropdown: React.FC<DropdownProps> = (props) => {
    const { children, className, items, hideArrow, ...rest } = props;
    const popoverRef = useRef<PopoverRef>(null);

    const onClickItem = async (item: IDropdownOption, index: number) => {
        if (item.onClick) {
            await item.onClick(item.value, index);
            popoverRef.current?.hide();
        }
    };

    return (
        <Popover
            ref={popoverRef}
            className={classNames(className, styles.popover)}
            content={
                <div className={styles.wrapper}>
                    {items.map((item, index) => (
                        <div key={index} className={styles.item} onClick={() => onClickItem(item, index)}>
                            {item.itemRender ? (
                                item.itemRender(item)
                            ) : (
                                <>
                                    {item.icon ? item.icon : null}
                                    <span>{item.label}</span>
                                </>
                            )}
                            {hideArrow ? null : <img className={styles.icon} src={iconUrl} alt='' />}
                        </div>
                    ))}
                    {items.length === 0 ? <div className={styles['no-data']}>暂无数据</div> : null}
                </div>
            }
            {...rest}
        >
            {children}
        </Popover>
    );
};

export const Dropdown = React.memo(_Dropdown);

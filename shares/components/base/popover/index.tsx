import classNames from 'classnames';
import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';

import { useUpdateEffect } from '@miyuan/hooks';
import { ComponentBaseProps } from '@miyuan/types';

import styles from './index.module.less';

export interface PopoverRef {
    show: () => void;
    hide: () => void;
}

export interface PopoverProps extends ComponentBaseProps {
    content: React.ReactNode;
    onVisibleChange?: (visible: boolean) => void;
    targetId?: string;
    maskClosable?: boolean;
}

const _Popover = forwardRef<PopoverRef, PopoverProps>((props, ref) => {
    const { children, content, className, style, onVisibleChange, targetId, maskClosable = true } = props;
    const [visible, setVisible] = useState(false);

    const show = (event: React.MouseEvent) => {
        event.stopPropagation();
        setVisible(true);
    };

    const hide = (event: React.MouseEvent) => {
        event.stopPropagation();
        setVisible(false);
    };

    const stopPropagation = async (event: React.MouseEvent) => {
        event.stopPropagation();
    };

    useUpdateEffect(() => {
        onVisibleChange?.(visible);
    }, [visible]);

    useEffect(() => {
        const node = document.querySelector(`#${targetId}`) as HTMLElement;
        if (!node) return;
        node.style.overflow = visible ? 'hidden' : '';
    }, [visible]);

    useImperativeHandle(ref, () => ({
        show: () => setVisible(true),
        hide: () => setVisible(false),
    }));

    return (
        <div className={styles.wrapper} style={style} onClick={show}>
            {children}
            {visible ? (
                <>
                    <div className={styles['popover-mask']} onClick={maskClosable ? hide : undefined} />
                    <div
                        className={classNames(styles['popover-content'], className)}
                        onClick={stopPropagation}
                    >
                        {content}
                    </div>
                </>
            ) : null}
        </div>
    );
});

export const Popover = React.memo(_Popover);

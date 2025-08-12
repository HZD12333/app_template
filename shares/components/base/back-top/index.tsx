import classnames from 'classnames';
import React, { useCallback, useRef, useEffect } from 'react';

import { useOnScroll } from '@miyuan/hooks';

import styles from './index.module.less';

const backTopIcon = 'https://img.gzzhitu.com/zhitu-api/1723444802864.png';

type BackTopProps = {
    targetId?: string;
    className?: string;
};

export const BackTop: React.FC<BackTopProps> = ({ targetId = 'root', className }) => {
    const container = useRef<HTMLDivElement | null>(null);
    const { hasScroll } = useOnScroll({ target: `#${targetId}` });

    const onBackTop = useCallback(() => {
        if (!container.current) return;
        container.current.scrollTo({
            top: 0,
        });
    }, []);

    useEffect(() => {
        const ele = document.querySelector(`#${targetId}`) as HTMLDivElement;
        container.current = ele;
    }, [targetId]);

    return (
        <>
            {hasScroll ? (
                <div className={classnames(styles['back-top'], className)} onClick={onBackTop}>
                    <img src={backTopIcon} alt='' />
                </div>
            ) : null}
        </>
    );
};

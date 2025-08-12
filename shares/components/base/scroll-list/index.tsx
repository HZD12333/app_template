import { useCallback } from 'react';

import { useOnScroll } from '@miyuan/hooks';
import { ComponentBaseProps } from '@miyuan/types';

import { NoData, BackTop, INoDataProps } from '@shares/components';

import './index.less';

interface ScrollListProps<T> extends ComponentBaseProps {
    items: T[];
    itemRender: (item: T, index?: number) => React.ReactNode;
    noData?: React.ReactNode;
    noDataProps?: INoDataProps;
    hasNext?: boolean;
    loading?: boolean;
    textColor?: string;
    showBackTop?: boolean;
    targetId?: string;
    bufferDistance?: number; // 滚动条距离底部触发单位
    onScroll?(scrollTop: number, event?: Event): void; // 滚动事件
    onEndReached(): void; // 底部触发回调事件
}

export function ScrollList<T = unknown>(props: ScrollListProps<T>) {
    const {
        items,
        itemRender,
        loading,
        hasNext,
        textColor,
        className,
        noData,
        noDataProps,
        showBackTop = true,
        targetId = 'root',
        bufferDistance = 20,
        onScroll,
        onEndReached,
    } = props;

    const handleScroll = useCallback(
        async (scrollTop: number, event?: Event) => {
            if (onScroll) {
                onScroll(scrollTop);
            }
            if (loading || !hasNext || !event) return;

            const target = event.target as HTMLDivElement;
            const distance: number = target.scrollHeight - target.scrollTop - target.clientHeight;

            if (distance <= bufferDistance) {
                await onEndReached();
            }
        },
        [bufferDistance, onEndReached, loading, hasNext],
    );

    const { hasScroll } = useOnScroll({
        target: `#${targetId}`,
        onScroll: handleScroll,
        distance: bufferDistance,
    });

    return (
        <div className='my-scroll-list'>
            <div className={className}>{items.map((item, index) => itemRender(item, index))}</div>
            {!items.length && !hasNext ? (
                noData ? (
                    noData
                ) : (
                    <NoData {...noDataProps} />
                )
            ) : (
                <div className='status' style={{ color: textColor }}>
                    {hasNext && loading ? (
                        <>
                            <div className='loading' />
                            加载中
                        </>
                    ) : null}

                    {!hasNext ? <div className='over'>到底了</div> : ''}
                </div>
            )}
            {hasScroll && showBackTop ? <BackTop /> : null}
        </div>
    );
}

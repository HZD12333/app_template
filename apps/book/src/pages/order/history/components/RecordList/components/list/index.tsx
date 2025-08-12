import dayjs from 'dayjs';
import React, { useState, useMemo } from 'react';

import { useCountDown, CountDownOptions, useMemoizedFn } from '@miyuan/hooks';
import { copy } from '@miyuan/native-apis';
import { toast } from '@miyuan/ui-omi';

import { Money } from '@shares/components/base/money';

import { requestCancelOrder } from '@/apis/historyRecordAndDetail';
import { HistoryRecordItem } from '@/apis/historyRecordAndDetail/model';

import styles from './index.module.less';

type DataItem = HistoryRecordItem;

type Props = {
    now?: number;
    dataItem: DataItem;
    handleDetails(path: string, query: { orderId?: string; afterSaleId?: string }): void;
};

const formater = (options: CountDownOptions) => {
    const { m, s } = options;

    return (
        <div className={styles.countdown}>
            <div className={styles['countdown-title']}>剩余支付时间：</div>
            <div className={styles['countdown-time']}>
                <span>{m > 9 ? m : `0${m}`}分</span>
                <span>{s > 9 ? s : `0${s}`}秒</span>
            </div>
        </div>
    );
};

const List = ({ now = Date.now(), dataItem, handleDetails }: Props) => {
    const [status] = useState(dataItem.orderStatus); // 本地状态流转

    const end = useMemo(() => {
        return status === 0 ? dayjs(dataItem.orderCreateTime).valueOf() + 10 * 60 * 1000 : 0;
    }, [dataItem.orderCreateTime, status]);

    const CountDown = useCountDown({
        now,
        end,
        interval: 100,
        formater,
    });

    // 取消订单
    const handleCancel = useMemoizedFn(async () => {
        const [_, error] = await requestCancelOrder({
            orderId: dataItem.orderId,
        });
        if (!error) {
            toast('取消成功');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    });

    // 绿色状态
    const green = useMemo(() => {
        return status === 1 || status === 2 || status === 0;
    }, [status]);

    // 禁止点击详情
    const handleItemClick = useMemoizedFn(() => {
        if (dataItem.orderStatus === 0) return; // 待支付不跳转

        const hashQuery = {
            orderId: dataItem.orderId || '',
            afterSaleId: dataItem?.afterSaleId || '',
        };

        //在售后中，直接进售后详情 /order/refund/refund-details
        const path = dataItem.afterSaleStatus === 1 ? '/order/refund/refund-details' : '/order/details';
        handleDetails(path, hashQuery);
    });

    const handleCopy = useMemoizedFn((e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        copy(dataItem.orderId || '');
    });

    return (
        <div className={styles['record-item']} onClick={handleItemClick}>
            <div className={styles['record-item-title']}>
                <div className={styles['title-left']}>{dataItem.orderCreateTime}</div>
                <span className={`${styles['title-right']} ${green ? styles['title-green'] : ''}`}>
                    {dataItem.orderStatusDesc}
                </span>
            </div>
            <div className={styles['record-item-goods']}>
                <div className={styles['record-item-goods-img']}>
                    <img src={dataItem?.goodsImg} alt='' />
                </div>
                <div className={styles['record-item-goods-inf']}>
                    <div className={styles['inf-top']}>
                        <div className={styles['inf-top-title']}>
                            <div className={styles['inf-top-title-eslisp']}>{dataItem?.goodsName}</div>
                        </div>
                        {status === 0 ? null : (
                            <div className={styles['inf-top-number']}>
                                <div className={styles.text}>订单号 {dataItem.orderId}</div>
                                <div className={styles.copy} onClick={handleCopy}>
                                    复制
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={styles['inf-bottom']}>
                        <div className={styles['inf-bottom-voucher']}>
                            <Money value={dataItem?.goodsPrice} color='#3D3D47' sizes={[28, 28]} />
                            <span className={styles.quantity}>x{dataItem?.quantity}</span>
                        </div>
                        <div className={styles['inf-bottom-origin']}>
                            <span className={styles.total}>{`共${dataItem.quantity}件商品，实付`}</span>
                            <Money value={dataItem?.paymentAmount} color='#FF3000' sizes={[32, 32]} />
                        </div>
                    </div>
                    {/* 待支付专属区域 */}
                    {status === 0 ? (
                        <div className={styles['inf-bottom-pay']}>
                            {CountDown}
                            <div className={styles['cancel-btn']} onClick={handleCancel}>
                                取消订单
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default List;

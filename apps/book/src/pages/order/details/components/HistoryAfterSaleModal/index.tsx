import { useState, useEffect } from 'react';

import { useMemoizedFn } from '@miyuan/hooks';
import { parseQuery } from '@miyuan/utils';

import { useNavigate } from '@shares/hooks';

import { getAfterSaleList } from '@/apis/historyRecordAndDetail';
import { AfterSaleItem } from '@/apis/historyRecordAndDetail/model';

import styles from './index.module.less';

// 售后类型和状态映射
const serviceTypeMap: Record<string, string> = {
    '1': '退货退款',
    '2': '仅退款',
};

interface Props {
    visible: boolean;
    onClose: () => void;
}

const AfterSaleHistoryModal = ({ visible, onClose }: Props) => {
    const navigateTo = useNavigate();
    const { orderId } = parseQuery();
    const [list, setList] = useState<AfterSaleItem[]>([]);

    const handleDetail = useMemoizedFn(async (afterSaleId: string) => {
        navigateTo('/order/refund/refund-details', {
            useHistory: true,
            appendQuery: true,
            query: {
                orderId,
                afterSaleId,
            },
        });
    });

    const handleRequestList = useMemoizedFn(async () => {
        const res = await getAfterSaleList({
            orderId,
        });
        if (!res) return;
        setList(res);
        // 3）点击"历史售后详情"按钮比校验该订单申请售后次数是否小于2，小于2则默认进入该历史售后详情。大于等于2则底部弹窗展示供用户选择查看的详情详情
        if (res.length === 1 && res[0]) handleDetail(res[0]?.afterSaleId);
    });

    useEffect(() => {
        if (visible) handleRequestList();
    }, [visible, handleRequestList]);

    if (!visible) return null;
    return (
        <div className={styles.mask}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    历史售后
                    <span className={styles.close} onClick={onClose} />
                </div>
                <div className={styles.body}>
                    {list.map((item) => (
                        <div className={styles.item} key={item.afterSaleId}>
                            <div className={styles.row}>
                                <span className={styles['row-type']}>{serviceTypeMap[item.serviceType]}</span>
                                <span className={styles['row-status']}>{item.afterSaleStatusDesc}</span>
                            </div>
                            <div className={styles.row}>
                                <span className={styles['row-desc']}>{item.reasonTypeDesc}</span>
                            </div>
                            <div className={styles.row}>
                                <span className={styles['row-time']}>{item.afterSaleTime}</span>
                                <div
                                    className={styles['row-detailBtn']}
                                    onClick={() => handleDetail(item.afterSaleId)}
                                >
                                    查看详情
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AfterSaleHistoryModal;

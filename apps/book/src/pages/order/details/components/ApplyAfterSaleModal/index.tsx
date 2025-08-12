import { useMemoizedFn } from '@miyuan/hooks';

import { useNavigate } from '@shares/hooks';

import { OrderDetail } from '@/apis/historyRecordAndDetail/model';

import DetailCardItem from '../DetailCardItem';

import styles from './index.module.less';

type Props = {
    visible: boolean;
    selfBooksInfo: OrderDetail;
    onClose: () => void;
};

const list = [
    {
        serviceType: 2,
        afterSaleTitle: '我要退款，无需退货',
        afterSaleStatusDesc: '没有收到货，或与商家协商同意不用退款，仅退款',
    },
    {
        serviceType: 1,
        afterSaleTitle: '我要退货退款',
        afterSaleStatusDesc: '已收到货，需要退还收到的货物',
    },
];

const AfterSaleHistoryModal = ({ visible, onClose, selfBooksInfo }: Props) => {
    const navigateTo = useNavigate();
    const handleApplyAfterSale = useMemoizedFn((item: { serviceType: number }) => {
        navigateTo('/order/refund/apply-for', {
            useHistory: true,
            appendQuery: true,
            query: {
                orderId: selfBooksInfo?.orderId || '',
                type: item.serviceType,
            },
        });
        onClose();
    });

    if (!visible) return null;
    return (
        <div className={styles.mask}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    请选择售后详情
                    <span className={styles.close} onClick={onClose} />
                </div>
                <div className={styles.body}>
                    <DetailCardItem selfBooksInfo={selfBooksInfo} />
                    <div className={styles.itemlist}>
                        {list.map((item) => (
                            <div className={styles.item} key={item.afterSaleTitle}>
                                <div className={`${styles.row} ${styles['row-type']}`}>
                                    {item.afterSaleTitle}
                                </div>
                                <div className={styles.row}>
                                    <span className={styles['row-desc']}>{item.afterSaleStatusDesc}</span>
                                    <div
                                        className={styles['row-detailBtn']}
                                        onClick={() => handleApplyAfterSale(item)}
                                    >
                                        申请
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AfterSaleHistoryModal;

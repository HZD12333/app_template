import { rewardDetailsItem } from '@/apis/reward/model';

import styles from './index.module.less';

type Props = {
    listItem: rewardDetailsItem;
};
const Status = {
    1: '已付款',
    3: '已结算',
    4: '已失效',
};

const OrderDetailsItem = (props: Props) => {
    const { listItem } = props;
    const truncateString = (str) => {
        return str.length > 6 ? str.substring(0, 6) + '...' : str;
    };

    const changeState = (status: string | number) => Status[status as 1];

    return (
        <div className={styles['list-item']}>
            <div className={styles.top}>
                <div className={styles.left}>
                    <div className={styles.title}>{truncateString('自营图书订单')}</div>
                    <div className={styles['img-time']}>{listItem.orderCreateTime}</div>
                </div>
                <div
                    className={`${styles.status} ${Number(listItem.orderStatus) < 3 ? styles['status-active'] : ''}`}
                >
                    {changeState(listItem.orderStatus || 1)}
                </div>
            </div>

            <div className={styles.contentWrap}>
                <div className={styles.leftP}>
                    <div className={styles.productMsg}>
                        <div className={styles['order-number']}>
                            <div className={styles.text}>订单号: {listItem.orderId}</div>
                        </div>
                        <div className={styles['order-phone']}>
                            <div className={styles.text}>下单手机号: {listItem.orderUserPhone}</div>
                        </div>
                    </div>
                    {listItem.rewardStatus === 2 && (
                        <img
                            className={styles.rewardImg}
                            src='https://img.gzzhitu.com/zhitu-api/1748933113337.png'
                            alt=''
                        />
                    )}
                </div>
                <div
                    className={`${styles.rewardAmount} ${listItem.orderStatus === 4 ? styles['price-1'] : ''}`}
                    style={{ textDecorationLine: `${listItem.orderStatus === 4 ? 'line-through' : ''}` }}
                >
                    <span className={styles.plusC}>+</span>
                    <span className={styles.span}>{listItem.rewardAmount}</span>元
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsItem;

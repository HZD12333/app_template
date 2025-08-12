import classNames from 'classnames';

import { couponItem } from '@/apis/coupon/model';

import styles from './index.module.less';

type Props = {
    listItem: couponItem;
};
const Status = ['待使用', '已使用', '过期'];
const CouponListItem = (props: Props) => {
    const { listItem } = props;
    const truncateString = (str) => {
        return str.length > 9 ? str.substring(0, 9) + '...' : str;
    };
    return (
        <div
            className={classNames(styles['list-wrapper-item'], {
                [styles.wrapperAshes]: listItem.status === 1 || listItem.status === 2,
            })}
        >
            <div className={styles.shopLeft}>
                <div className={`${styles.price} ${listItem.price.length > 5 ? styles.price1 : ''}`}>
                    <span className={styles.sign}>¥</span>
                    {listItem.price}
                </div>
                <div className={styles.couponTip}>{listItem.couponTip}</div>
            </div>
            <div className={styles['title-time']}>
                <div className={styles.tilte}>{truncateString(listItem.title)}</div>
                <div className={styles.time}>
                    {listItem.startTime}-{listItem.endTime}
                </div>
                <div
                    className={classNames(styles.couponId, {
                        [styles.couponIdAshes]: listItem.status === 1 || listItem.status === 2,
                    })}
                >
                    券码：{listItem.couponId}
                </div>
            </div>
            <div
                className={classNames(styles['price-btn'], {
                    [styles.btnAshes]: listItem.status === 1 || listItem.status === 2,
                })}
            >
                {Status[listItem.status]}
            </div>
        </div>
    );
};

export default CouponListItem;

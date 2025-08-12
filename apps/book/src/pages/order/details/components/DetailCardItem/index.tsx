/* eslint-disable react/no-danger */
import { Money } from '@shares/components/base/money';

import { OrderDetail } from '@/apis/historyRecordAndDetail/model';

import styles from './index.module.less';
type prop = {
    selfBooksInfo: OrderDetail;
};

const DetailCardItem = (props: prop) => {
    const { selfBooksInfo } = props;

    return (
        <div className={styles.goodsInfo}>
            <img src={selfBooksInfo?.goodsImg} alt='' />
            <div className={styles.goodsDetail}>
                <div className={styles.goodsName}>
                    <div className={styles['goodsName-eslisp']}>{selfBooksInfo?.goodsName}</div>
                </div>
                <div className={styles['goodsDetail-bottom']}>
                    <div className={styles.quantity}>x{selfBooksInfo?.quantity}</div>
                    <div className={styles['goodsDetail-bottom-top']}>
                        <div className={styles['top-left']}>
                            <Money
                                className={styles.goodsPrice}
                                value={selfBooksInfo?.goodsPrice}
                                color='#3D3D47'
                                sizes={[32, 32]}
                            />
                            <span className={styles.goodsOriginalPrice}>
                                ￥{selfBooksInfo?.goodsOriginalPrice}
                            </span>
                        </div>
                        <div className={styles['top-right']}>
                            <span className={styles.actualPay}>实付</span>
                            <Money value={selfBooksInfo?.paymentAmount} color='#FF3000' sizes={[32, 32]} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default DetailCardItem;

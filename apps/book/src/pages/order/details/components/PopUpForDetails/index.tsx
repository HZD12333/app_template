/* eslint-disable no-alert */
import { useState } from 'react';

import { useMemoizedFn } from '@miyuan/hooks';
import { copy } from '@miyuan/native-apis';
import { toast, openDialog } from '@miyuan/ui-omi';

import { useNavigate } from '@shares/hooks';

import { requestConfirmReceipt, requestCancelAfterSale } from '@/apis/historyRecordAndDetail';
import { OrderDetail } from '@/apis/historyRecordAndDetail/model';

import ApplyAfterSaleModal from '../ApplyAfterSaleModal';
import DetailCardItem from '../DetailCardItem';
import HistoryAfterSaleModal from '../HistoryAfterSaleModal';

import styles from './index.module.less';

type prop = {
    selfBooksInfo: OrderDetail;
};

const statusArr = [
    { status: 0, desc: '待支付' },
    { status: 1, desc: '待发货' },
    { status: 2, desc: '待收货' },
    { status: 3, desc: '已完成' },
    { status: 4, desc: '已关闭' },
    { status: 5, desc: '退款/售后' },
];

export function getOrderStatusDesc(status: number) {
    return statusArr.find((item) => item.status === status)?.desc || '';
}

const PopUpForDetails = ({ selfBooksInfo }: prop) => {
    const navigateTo = useNavigate();
    const [showModal, setShowModal] = useState('');
    const [modalInfo, setModalInfo] = useState({
        theme: '取消',
        content: '取消活动后，活动费用将在48小时内原路退回至您的支付宝，是否确认取消',
    });

    // 复制快递单号
    const handleCopy = useMemoizedFn(() => {
        copy(selfBooksInfo?.deliverySn || '');
    });

    const handleModal = (show?: string) => {
        setShowModal(show || '');
    };

    const handleCommitCancel = useMemoizedFn(async () => {
        const params = {
            orderId: selfBooksInfo?.orderId,
        };
        const [_, error] =
            modalInfo?.theme === '收货'
                ? await requestConfirmReceipt(params)
                : await requestCancelAfterSale(params);

        if (!error) {
            toast(`${modalInfo.theme}成功`);
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }

        handleModal();
    });

    const handleCancel = useMemoizedFn((content: { theme: string; content: string }) => {
        setModalInfo(content);
        openDialog({
            title: '提示',
            content: content.content,
            okText: `确定${content.theme}`,
            cancelText: '取消',
            textStyle: 'text-align: center;',
            hideCancelBtn: false,
            onOk: handleCommitCancel,
        });
    });

    // 订单状态渲染
    const renderStatus = () => {
        let statusText = '';
        // 0-等待买家付款 1-等待商家发货 2-等待买家收货 3-确认收货，交易完成 4-交易关闭 5-退款/售后处理中 6-退款成功，交易关闭
        if (selfBooksInfo?.detailTitleType === 0) {
            statusText = '等待买家付款';
        } else if (selfBooksInfo?.detailTitleType === 1) {
            statusText = '等待商家发货';
        } else if (selfBooksInfo?.detailTitleType === 2) {
            statusText = '等待买家收货';
        } else if (selfBooksInfo?.detailTitleType === 5) {
            statusText = '退款/售后处理中';
        } else if (selfBooksInfo?.detailTitleType === 6) {
            statusText = '退款成功，交易关闭';
        } else if (selfBooksInfo?.detailTitleType === 3) {
            statusText = '确认收货，交易完成';
        } else if (selfBooksInfo?.detailTitleType === 4) {
            statusText = '交易关闭';
        }

        const myClassName =
            selfBooksInfo?.detailTitleType === 1 || selfBooksInfo?.detailTitleType === 2
                ? styles.green
                : selfBooksInfo?.detailTitleType === 5
                  ? styles.red
                  : styles.normal;

        return <span className={myClassName}>{statusText}</span>;
    };

    const handleAfterSale = useMemoizedFn(() => {
        if (selfBooksInfo?.orderStatusDesc === '待发货') {
            // 待发货 : 跳转仅退款详情
            const serviceType = 2; // 售后类型：1-退货退款 2-仅退款
            navigateTo('/order/refund/apply-for', {
                useHistory: true,
                appendQuery: true,
                query: {
                    orderId: selfBooksInfo?.orderId || '',
                    type: serviceType,
                },
            });
        } else if (selfBooksInfo?.orderStatusDesc === '待收货') {
            // 待收货 : 弹窗选择售后类型
            handleModal('APPLY_AFTERSALE');
        }
    });
    const handleAfterSaleInfo = useMemoizedFn(() => {
        navigateTo('/order/refund/refund-details', {
            useHistory: true,
            appendQuery: true,
            query: {
                orderId: selfBooksInfo?.orderId || '',
            },
        });
    });
    const renderFooter = () => {
        return (
            <>
                {selfBooksInfo.showAfterSaleHistory && (
                    <div
                        className={`${styles.btn} ${styles['btn-border']} ${styles['btn-padding']}`}
                        onClick={() => handleModal('AFTERSALE')}
                    >
                        历史售后详情
                    </div>
                )}
                {selfBooksInfo?.showAfterSale && (
                    <div className={`${styles.btn} ${styles['btn-white']}`} onClick={handleAfterSale}>
                        申请售后
                    </div>
                )}
                {selfBooksInfo.showAfterSaleInfo && (
                    <div className={`${styles.btn} ${styles['btn-border']}`} onClick={handleAfterSaleInfo}>
                        售后详情
                    </div>
                )}
                {selfBooksInfo.showCancelAfterSale && (
                    <div
                        className={`${styles.btn} ${styles['btn-white']}`}
                        onClick={() =>
                            handleCancel({
                                theme: '撤销',
                                content: '撤销后，若超出订单服务保障期，将无法再次发起售后申请。',
                            })
                        }
                    >
                        撤销售后
                    </div>
                )}
                {selfBooksInfo.showConfirm && (
                    <div
                        className={`${styles.btn} ${styles['btn-yellow']}`}
                        onClick={() =>
                            handleCancel({
                                theme: '收货',
                                content: '为了保证您的售后权益，请收到货检查确认无误后再确认收货。',
                            })
                        }
                    >
                        确认收货
                    </div>
                )}
            </>
        );
    };

    return (
        <div className={styles.orderDetailPage}>
            <div className={styles.header}>{renderStatus()}</div>
            {/* 发货信息 */}
            {(selfBooksInfo?.orderStatus === 2 ||
                selfBooksInfo?.orderStatus === 3 ||
                selfBooksInfo?.orderStatus === 4 ||
                selfBooksInfo?.orderStatus === 5) &&
                selfBooksInfo?.deliverySn && (
                    <div className={styles.deliveryInfo}>
                        <div className={styles.deliverybox}>
                            <span>{selfBooksInfo?.deliveryCompany}</span>
                            <span>{selfBooksInfo?.deliverySn}</span>
                        </div>
                        {
                            <div className={styles.copy} onClick={handleCopy}>
                                复制
                            </div>
                        }
                    </div>
                )}
            {/* 地址信息 */}
            <div className={styles.receiverInfo}>
                <div className={styles['receiverInfo-number']}>
                    <span>{selfBooksInfo?.receiverInfo.contactName}</span>
                    <span>{selfBooksInfo?.receiverInfo.contactPhone}</span>
                </div>
                <div className={styles['receiverInfo-address']}>
                    <img src='https://img.gzzhitu.com/zhitu-api/1746689266372.png' alt='' />

                    <div className={styles['receiverInfo-address-exact']}>
                        <div className={styles['receiverInfo-address-exact-eslisp']}>
                            {selfBooksInfo?.receiverInfo.addressDetail}
                        </div>
                    </div>
                </div>
            </div>
            {/* 商品信息 */}
            <DetailCardItem selfBooksInfo={selfBooksInfo} />
            <div className={styles['detail-title']}>订单详情</div>
            {/* 订单明细 */}
            <div className={styles.orderInfo}>
                <div>
                    <span>订单状态</span>
                    <span>{selfBooksInfo?.orderStatusDesc}</span>
                </div>
                <div>
                    <span>订单价格</span>
                    <span>￥{selfBooksInfo?.goodsPrice}</span>
                </div>
                <div>
                    <span>购买数量</span>
                    <span>{selfBooksInfo?.quantity}</span>
                </div>
                <div>
                    <span>运费金额</span>
                    <span>￥{selfBooksInfo?.freightPrice}</span>
                </div>
                <div>
                    <span>订单总价</span>
                    <span>￥{selfBooksInfo?.totalAmount}</span>
                </div>
                <div>
                    <span>优惠券抵扣</span>
                    <span>-￥{selfBooksInfo?.discountAmount}</span>
                </div>
                <div>
                    <span>实付款</span>
                    <span>￥{selfBooksInfo?.paymentAmount}</span>
                </div>
                <div>
                    <span>下单时间</span>
                    <span>{selfBooksInfo?.orderCreateTime}</span>
                </div>
                <div>
                    <span>订单编号</span>
                    <span>{selfBooksInfo?.orderId}</span>
                </div>
            </div>
            {/* 底部按钮 */}
            <div className={styles.footer}>{renderFooter()}</div>
            <HistoryAfterSaleModal visible={showModal === 'AFTERSALE'} onClose={() => handleModal()} />
            <ApplyAfterSaleModal
                visible={showModal === 'APPLY_AFTERSALE'}
                onClose={() => handleModal()}
                selfBooksInfo={selfBooksInfo}
            />
        </div>
    );
};
export default PopUpForDetails;

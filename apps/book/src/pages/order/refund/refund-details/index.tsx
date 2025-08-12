import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useEffect, useState, useCallback } from 'react';

import { useMemoizedFn } from '@miyuan/hooks';
import { copy, goSuperEntrance } from '@miyuan/native-apis';
import { toast, openDialog } from '@miyuan/ui-omi';
import { parseQuery } from '@miyuan/utils';

import { NavBar } from '@shares/components';
import { uploadFileToOss } from '@shares/utils/upload-file';

import {
    getOrderDetail,
    getOssConfig,
    submitReturnInfo,
    getAfterSaleDetail,
    cancelAfterSale,
} from '@/apis/refund';
import { refundDetails, OrderDetails, FormReturnType, OssConfigType, FileType } from '@/apis/refund/model';

import BottomPopup from '../components/bottomPopup';

import styles from './index.module.less';

type orderDetailsInfo = OrderDetails;
const maxSize = 10 * 1024 * 1024;
const serviceArr = [
    { status: 1, desc: '退货退款' },
    { status: 2, desc: '仅退款' },
];
const companyList = [
    { name: '申通快递', id: 1 },
    { name: '百世快递', id: 2 },
    { name: '顺丰快递', id: 3 },
    { name: '圆通快递', id: 4 },
    { name: '邮政快递', id: 5 },
    { name: '京东快递', id: 6 },
    { name: '韵达快递', id: 7 },
    { name: '德邦快递', id: 8 },
    { name: '中通快递', id: 9 },
    { name: '极兔快递', id: 10 },
    { name: '菜鸟速递', id: 11 },
    { name: '其他快递', id: 12 },
];

export function getServiceStatusDesc(status: number) {
    return serviceArr.find((item) => item.status === status)?.desc || '';
}
const RefundDetails = () => {
    const { afterSaleId, orderId } = parseQuery();
    const [ossConfig, setOssConfig] = useState<OssConfigType>();
    const [refundDetailsData, setRefundDetailsData] = useState<refundDetails>();
    const [orderDetail, setOrderDetailData] = useState<orderDetailsInfo>({} as orderDetailsInfo);
    const [isFocus, setIsFocus] = useState<boolean>(false);
    const [showPopUp, setShowPopUp] = useState<boolean>(false);
    // const [refundDeadlineTime, setRefundDeadlineTime] = useState('');
    const [currentName, setCurrentName] = useState('');
    const [formData, setFormData] = useState<FormReturnType>({
        afterSaleId,
        deliveryCompany: '',
        deliverySn: '',
        returnRemark: '',
        returnPics: [],
    });

    const geAfterSaleDetailData = async () => {
        const rsp = await getAfterSaleDetail({ orderId, afterSaleId });
        // if (rsp?.data?.returnDeadline) {
        //     const time = rsp.timestamp; // 服务器时间
        //     const TIME = 1000;
        //     const lastTime =
        //         new Date(rsp.data.returnDeadline.replace(/-/g, '/')).valueOf() - time > 0
        //             ? new Date(rsp.data.returnDeadline.replace(/-/g, '/')).valueOf() - time
        //             : 0;
        //     const d = Math.floor(lastTime / TIME / 60 / 60 / 24);
        //     const hv = (lastTime - d * 24 * 60 * 60 * TIME) / TIME / 60 / 60;
        //     const h = Math.floor(hv) < 10 ? `0${Math.floor(hv)}` : Math.floor(hv);
        //     setRefundDeadlineTime(`${d}天${h}小时`);
        // }
        setRefundDetailsData(rsp?.data);
    };
    const getOssConfigData = async () => {
        const res = await getOssConfig();
        console.log('res---', res);
        setOssConfig(res);
    };
    const getOrderDetailData = useCallback(async () => {
        const res = await getOrderDetail({ orderId });
        console.log(res);
        setOrderDetailData(res as orderDetailsInfo);
    }, []);
    const handleReasoRefund = (id: number, name: string) => {
        console.log(id);
        setCurrentName(name);
        setShowPopUp(false);
    };

    const handleCancel = () => {
        setShowPopUp(false);
    };
    const openServiceKf = () => {
        // const { origin, pathname } = window.location;
        // const isTestEnv = origin.includes('uat0');
        // const domain = isTestEnv ? origin.replace('boliy.cn', 'gzmiyuan.com') : 'https://api.gzmiyuan.com';
        const url = 'https://api.gzmiyuan.com/api/h5/miyuan_new_h5/#/service/home';
        const obj = {
            title: '',
            url,
            type: 41,
            open: 3,
            splicePid: '',
        };
        console.log(obj);
        goSuperEntrance(obj);
    };
    // 输入备注说明内容
    const onChangeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({ ...formData, returnRemark: e.target.value });
    };
    const onTextAreaFocus = () => {
        const inputDiv = document.querySelector('#my-text-input') as HTMLElement;
        console.log(inputDiv);
        // if (inputDiv) {
        //     inputDiv.focus();
        // }
    };
    const onDelete = (index: number) => {
        formData.returnPics.splice(index, 1);
        setFormData({ ...formData, returnPics: formData.returnPics });
    };
    const uploadImage = async (e: any) => {
        // 获取oss配置
        if (!ossConfig) {
            return;
        }
        const files: FileType[] = e.target.files;
        if (files && files.length > 3) {
            toast('最多3张图片');
            return;
        }
        const bigSizeImages = [...files].filter((file) => file.size > maxSize);
        if (bigSizeImages.length > 0) {
            toast('单张图片大小不能超过10M，请重新上传');
            return;
        }
        const imgPath: { value: string; key: string }[] = [];
        Object.keys(files).forEach(async (index) => {
            const res = await uploadFileToOss(ossConfig, files[index]);
            if (res && typeof res === 'string') {
                imgPath.push({
                    value: res,
                    key: index,
                });
                if (files.length === imgPath.length) {
                    const newImages = imgPath.sort((a, b) => Number(a.key) - Number(b.key));
                    const arryImg = formData.returnPics || [];
                    for (const newImage of newImages) {
                        arryImg.push(newImage.value);
                    }
                    setFormData({ ...formData, returnPics: arryImg });
                }
            }
        });
    };

    const submit = async () => {
        formData.deliveryCompany = currentName;
        formData.afterSaleId = refundDetailsData?.afterSaleId || '';
        if (!currentName) {
            toast('请选择快递公司~');
            return;
        }
        if (!formData.deliverySn) {
            toast('请填写订单号~');
            return;
        }
        const res = await submitReturnInfo(formData);
        setFormData({ ...formData, deliveryCompany: currentName, afterSaleId: formData.afterSaleId });
        console.log('填写退货时间', res);
        if (res[0] && res[0].code) {
            window.location.reload();
        }
    };
    const handleCommitCancel = useMemoizedFn(async () => {
        const rsp = await cancelAfterSale({ orderId });
        if (rsp && rsp[0].code === '0') {
            history.go(-1);
        }
    });
    const handleRevoke = async () => {
        openDialog({
            title: '提示',
            content: '撤销后，若超出订单服务保障期，将无法再次发起售后申请。',
            hideCancelBtn: false,
            hideOkBtn: false,
            cancelText: '取消',
            okText: '确定撤销',
            onOk: handleCommitCancel,
        });
    };
    const onCopyAddress = () => {
        console.log(refundDetailsData?.returnAddress || '');
        copy(refundDetailsData?.returnAddress || '');
    };
    useEffect(() => {
        geAfterSaleDetailData();
        getOrderDetailData();
        getOssConfigData();
    }, []);

    return (
        <div className={styles.applyForRefund}>
            <NavBar backgroundColor='#FFFFFF' rightExtra={<></>} useReactHistory>
                退款详情{`${refundDetailsData?.serviceType === 2 ? ' - 仅退款' : ''}`}
            </NavBar>
            {refundDetailsData && (
                <>
                    <div className={styles.refundState}>
                        <div
                            className={classNames(styles.stateTxt, {
                                [styles.stateTxt1]:
                                    refundDetailsData.afterSaleStatus === 0 ||
                                    refundDetailsData.afterSaleStatus === 4,
                            })}
                        >
                            {refundDetailsData.afterSaleStatusDesc}
                        </div>
                        {refundDetailsData.serviceType === 1 &&
                            refundDetailsData.afterSaleStatus === 1 &&
                            refundDetailsData.returnStatus === 1 && (
                                <div className={styles.time}>
                                    请在
                                    <span>
                                        {dayjs(refundDetailsData.returnDeadline).format('YYYY-MM-DD HH:mm')}
                                    </span>
                                    前填写快递单号
                                </div>
                            )}
                        {refundDetailsData.afterSaleStatus === 4 && refundDetailsData.handleNote && (
                            <div className={styles.time}>拒绝原因：{refundDetailsData.handleNote}</div>
                        )}
                        <div className={styles.time}>{refundDetailsData.gmtModified}</div>
                    </div>
                    {refundDetailsData.serviceType === 1 && refundDetailsData.afterSaleStatus === 1 && (
                        <>
                            <div className={styles.goodsInfo}>
                                <img src={orderDetail?.goodsImg} alt='' />
                                <div className={styles.rightInfo}>
                                    <div className={styles.title}>{orderDetail?.goodsName}</div>
                                    <div className={styles.bottomI}>
                                        <div className={styles.price}>¥{orderDetail?.goodsPrice}</div>
                                        <div className={styles.num}>x{orderDetail?.quantity}</div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    {refundDetailsData.afterSaleDeliveryCompany && (
                        <>
                            <div className={`${styles.form} ${styles.formInfo}`}>
                                <div className={styles.formItem}>
                                    <div className={styles.aRow}>
                                        <div className={styles.label}>快递公司</div>
                                        <div className={styles.label}>
                                            {refundDetailsData.afterSaleDeliveryCompany}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.formItem}>
                                    <div className={styles.aRow}>
                                        <div className={styles.label}>快递单号</div>
                                        <div className={styles.label}>
                                            {refundDetailsData.afterSaleDeliverySn}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    {refundDetailsData.serviceType === 1 &&
                    refundDetailsData.afterSaleStatus === 1 &&
                    !refundDetailsData.afterSaleDeliverySn ? (
                        <>
                            <div className={styles.fillInOrder}>
                                <div className={styles.item}>
                                    <div className={styles.title}>快递公司</div>
                                    {!currentName ? (
                                        <div className={styles.right} onClick={() => setShowPopUp(true)}>
                                            请选择快递公司{' '}
                                            <img
                                                src='https://img.gzzhitu.com/zhitu-api/1747908155654.png'
                                                alt=''
                                            />
                                        </div>
                                    ) : (
                                        <div className={styles.right1} onClick={() => setShowPopUp(true)}>
                                            {currentName}{' '}
                                            <img
                                                src='https://img.gzzhitu.com/zhitu-api/1747908155654.png'
                                                alt=''
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className={styles.item}>
                                    <div className={styles.title}>快递单号</div>
                                    <div className={styles.right}>
                                        <input
                                            placeholder='请输入你的订单号'
                                            type=''
                                            value={formData.deliverySn}
                                            onChange={(e) => {
                                                setFormData({ ...formData, deliverySn: e.target.value });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className={styles.oneItem}>
                                    <div className={styles.top}>
                                        <div className={styles.left}>商家地址：</div>
                                        <div className={styles.rightA} onClick={() => onCopyAddress()}>
                                            复制地址
                                        </div>
                                    </div>
                                    <div
                                        className={styles.textarea}
                                        dangerouslySetInnerHTML={{
                                            __html: refundDetailsData.returnAddress.replace(/\n/g, '<br>'),
                                        }}
                                    />
                                    {/* <textarea
                                        id='my-text-input'
                                        value={refundDetailsData.returnAddress}
                                        disabled
                                    /> */}
                                </div>
                            </div>
                            <div className={styles.fillInOrder}>
                                <div className={`${styles.formItem} ${styles.formItem1}`}>
                                    <div className={styles.label}>退货留言</div>
                                    <div className={styles.input}>
                                        <textarea
                                            id='my-text-input'
                                            className={styles['textarea-info']}
                                            value={formData.returnRemark}
                                            placeholder={isFocus ? '' : '请详细填写您的退货留言'}
                                            onChange={onChangeContent}
                                            onTouchStart={onTextAreaFocus}
                                            onFocus={() => {
                                                setIsFocus(true);
                                            }}
                                            onBlur={() => {
                                                setIsFocus(false);
                                            }}
                                            maxLength={200}
                                        />
                                    </div>
                                </div>
                                <div className={`${styles.formItem} ${styles.formItem1}`}>
                                    <div className={styles.label}>
                                        上传凭证<span>（最多可上传3张）</span>
                                    </div>
                                    <div className={styles.up}>
                                        {formData.returnPics.map((item, index) => (
                                            <>
                                                <div
                                                    className={`${styles.upImg} ${formData.returnPics.length > 0 ? '' : styles.marginTop50}`}
                                                    key={index}
                                                >
                                                    <img alt='' className={styles.licenseFile} src={item} />
                                                    <img
                                                        className={styles.delImg}
                                                        src='https://img.gzzhitu.com/zhitu-api/1748502619523.png'
                                                        onClick={() => onDelete(index)}
                                                        alt=''
                                                    />
                                                </div>
                                            </>
                                        ))}
                                        {formData.returnPics.length < 3 && (
                                            <>
                                                <div className={styles.upImg}>
                                                    <img
                                                        alt=''
                                                        className={styles.one}
                                                        src='https://img.gzzhitu.com/zhitu-api/1747126512791.png'
                                                    />
                                                    <div className={styles.upText}>上传凭证</div>
                                                    <input
                                                        type='file'
                                                        accept='image/*'
                                                        name=''
                                                        id='file'
                                                        onChange={uploadImage}
                                                        multiple
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className={styles.form}>
                            <div className={styles.formItem}>
                                {refundDetailsData.returnStatus !== 2 && (
                                    <div className={styles.aRow}>
                                        <div className={styles.label}>售后类型</div>
                                        <div className={styles.label}>
                                            {getServiceStatusDesc(refundDetailsData.serviceType)}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className={styles.formItem}>
                                <div className={styles.aRow}>
                                    <div className={styles.label}>订单编号</div>
                                    <div className={styles.label}>{refundDetailsData.orderId}</div>
                                </div>
                            </div>
                            <div className={styles.formItem}>
                                <div className={styles.aRow}>
                                    <div className={styles.label}>下单时间</div>
                                    <div className={styles.label}>{refundDetailsData.orderCreateTime}</div>
                                </div>
                            </div>
                            <div className={styles.formItem}>
                                <div className={styles.aRow}>
                                    <div className={styles.label}>订单状态</div>
                                    <div className={styles.label}>{refundDetailsData.orderStatusDesc}</div>
                                </div>
                            </div>
                            {refundDetailsData.returnStatus === 2 && (
                                <>
                                    <div className={styles.formItem}>
                                        <div className={styles.aRow}>
                                            <div className={styles.label}>售后时间</div>
                                            <div className={styles.label}>
                                                {refundDetailsData.afterSaleTime}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.formItem}>
                                        <div className={styles.aRow}>
                                            <div className={styles.label}>退回时间</div>
                                            <div className={styles.label}>{refundDetailsData.returnTime}</div>
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className={styles.formItem}>
                                <div className={styles.aRow}>
                                    <div className={styles.label}>订单总价</div>
                                    <div className={styles.label}>¥{refundDetailsData.totalAmount}</div>
                                </div>
                            </div>
                            <div className={styles.formItem}>
                                <div className={styles.aRow}>
                                    <div className={styles.label}>运费</div>
                                    <div className={styles.label}>¥{refundDetailsData.freightPrice}</div>
                                </div>
                            </div>
                            <div className={styles.formItem}>
                                <div className={styles.aRow}>
                                    <div className={styles.label}>优惠券抵扣</div>
                                    <div className={styles.label}>-¥{refundDetailsData.discountAmount}</div>
                                </div>
                            </div>
                            <div className={styles.formItem}>
                                <div className={styles.aRow}>
                                    <div className={styles.label}>实付款</div>
                                    <div className={`${styles.label} ${styles.label2}`}>
                                        ¥{refundDetailsData.paymentAmount}
                                    </div>
                                </div>
                            </div>
                            {refundDetailsData.refundAmount && (
                                <>
                                    <div className={styles.formItem}>
                                        <div className={styles.aRow}>
                                            <div className={styles.label}>退款金额</div>
                                            <div className={`${styles.label} ${styles.label2}`}>
                                                ¥{refundDetailsData.refundAmount}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            {refundDetailsData.returnStatus !== 2 && (
                                <>
                                    <div className={styles.formItem}>
                                        <div className={styles.aRow}>
                                            <div className={styles.label}>退款原因</div>
                                            <div className={styles.label}>
                                                {refundDetailsData.reasonTypeDesc}
                                            </div>
                                        </div>
                                    </div>
                                    {refundDetailsData.reasonDetail && (
                                        <>
                                            <div className={styles.formItem}>
                                                <div className={styles.aRow}>
                                                    <div className={styles.label}>备注说明</div>
                                                    <div
                                                        className={styles.inputD}
                                                        dangerouslySetInnerHTML={{
                                                            __html: refundDetailsData.reasonDetail.replace(
                                                                /\n/g,
                                                                '<br>',
                                                            ),
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {refundDetailsData.proofPics &&
                                        refundDetailsData.proofPics.length > 0 && (
                                            <div className={styles.formItem}>
                                                <div className={styles.label}>上传凭证</div>
                                                <div className={`${styles.up} ${styles.up1}`}>
                                                    {refundDetailsData.proofPics &&
                                                        refundDetailsData.proofPics.map((item, index) => (
                                                            <img
                                                                alt=''
                                                                key={index}
                                                                className={styles.licenseFile}
                                                                src={item}
                                                            />
                                                        ))}
                                                </div>
                                            </div>
                                        )}
                                </>
                            )}
                        </div>
                    )}
                    <div className={styles.btns}>
                        {refundDetailsData.serviceType === 1 &&
                        refundDetailsData.afterSaleStatus === 1 &&
                        !refundDetailsData.afterSaleDeliverySn ? (
                            <div className={styles.contact} onClick={submit}>
                                确认提交
                            </div>
                        ) : (
                            <>
                                {refundDetailsData.showCancel && (
                                    <div className={styles.revoke} onClick={handleRevoke}>
                                        撤销申请
                                    </div>
                                )}
                                <div className={styles.contact} onClick={openServiceKf}>
                                    联系客服
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
            {showPopUp && (
                <BottomPopup
                    defaultActive={currentName}
                    data={companyList}
                    onConfirm={handleReasoRefund}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
};

export default RefundDetails;

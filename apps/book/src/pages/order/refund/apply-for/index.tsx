import { useEffect, useState, useCallback } from 'react';

import { useMemoizedFn } from '@miyuan/hooks';
import { toast, openDialog } from '@miyuan/ui-omi';
import { parseQuery } from '@miyuan/utils';

import { NavBar } from '@shares/components';
import { uploadFileToOss } from '@shares/utils/upload-file';

// import deCommon from 'src/declares/common';
import { getOrderDetail, getOssConfig, submitAfterSale } from '@/apis/refund';
import { FormDataType, OrderDetails, OssConfigType, FileType } from '@/apis/refund/model';

import BottomPopup from '../components/bottomPopup';

import styles from './index.module.less';

type orderDetailsInfo = OrderDetails;
const maxSize = 10 * 1024 * 1024;
const Reason_refund_types = [
    { name: '不想要了', id: 1 },
    { name: '收货地址填错了', id: 2 },
    { name: '与描述不符', id: 3 },
    { name: '收到商品损坏了', id: 4 },
    { name: '未按预定时间发货', id: 5 },
    { name: '其他原因', id: 6 },
];
const Reason_refund_types1 = [
    { name: '不想要了', id: 1 },
    { name: '与描述不符', id: 3 },
    { name: '收到商品损坏了', id: 4 },
    { name: '其他原因', id: 6 },
];
const ApplyForRefund = () => {
    const { orderId, type, inviteCode, token } = parseQuery();
    const [ossConfig, setOssConfig] = useState<OssConfigType>();
    const [orderDetail, setOrderDetailData] = useState<orderDetailsInfo>({} as orderDetailsInfo);
    const [showPopUp, setShowPopUp] = useState<boolean>(false);
    const [refunId, setRefunId] = useState(1);
    const [currentName, setCurrentName] = useState('');
    const [isFocus, setIsFocus] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormDataType>({
        orderId: orderId,
        serviceType: Number(type),
        reasonType: 0,
        reasonDetail: '',
        proofPics: [],
    });

    const getOrderDetailData = useCallback(async () => {
        const res = await getOrderDetail({ orderId });
        console.log(res);
        setOrderDetailData(res as orderDetailsInfo);
    }, []);

    const getOssConfigData = async () => {
        const res = await getOssConfig();
        console.log('res---', res);
        setOssConfig(res);
    };

    const handleRefundAmount = (detail: orderDetailsInfo) => {
        if (!detail || !detail.paymentAmount) return '';
        if (detail.orderStatus === 1) return detail?.paymentAmount;
        const num = (Number(detail.paymentAmount) * 100 - Number(detail.freightPrice) * 100) / 100;
        if (num < 0) return '0';
        return num.toString();
    };

    const handleReasoRefund = (id: number, name: string) => {
        setRefunId(id);
        setCurrentName(name);
        setShowPopUp(false);
    };

    const handleCancel = () => {
        setShowPopUp(false);
    };

    const onTextAreaFocus = () => {
        const inputDiv = document.querySelector('#my-text-input') as HTMLElement;
        console.log(inputDiv);
        // if (inputDiv) {
        //     inputDiv.focus();
        // }
    };

    // 输入备注说明内容
    const onChangeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({ ...formData, reasonDetail: e.target.value });
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
                    const arryImg = formData.proofPics || [];
                    for (const newImage of newImages) {
                        arryImg.push(newImage.value);
                    }
                    setFormData({ ...formData, proofPics: arryImg });
                }
            }
        });
    };
    const onDelete = (index: number) => {
        formData.proofPics.splice(index, 1);
        setFormData({ ...formData, proofPics: formData.proofPics });
    };

    const handleCommitCancel = useMemoizedFn(async () => {
        const host = window.location.host;
        const domain = host.includes('uat') ? 'uat01' : 'api';
        window.location.replace(
            `https://${domain}.gzmiyuan.com/api/h5/book/#/order/refund/refund-details?orderId=${orderId}&inviteCode=${inviteCode}&token=${token}`,
        );
    });
    const submit = async () => {
        console.log(refunId);
        formData.reasonType = refunId;
        console.log(888, formData);
        if (!currentName) {
            toast('请选择退款原因~');
            return;
        }
        const res = await submitAfterSale(formData);
        setFormData({ ...formData, reasonType: refunId });
        console.log('申请退款', res);
        if (res[0] && res[0].code) {
            openDialog({
                title: '提示',
                content: '退款提交成功，退款成功后优惠券将3个工作日内退回',
                hideOkBtn: false,
                // cancelText: '取消',
                hideCancelBtn: true,
                okText: '知道了',
                onOk: handleCommitCancel,
            });
        }
    };
    useEffect(() => {
        getOrderDetailData();
        getOssConfigData();
    }, []);

    return (
        <div className={styles.applyForRefund}>
            <NavBar backgroundColor='#F5F7F9' rightExtra={<></>} useReactHistory>
                申请退款{`${Number(type) === 2 ? ' - 仅退款' : ''}`}
            </NavBar>
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
            <div className={styles.titleT}>退款详情</div>
            <div className={styles.form}>
                <div className={styles.formItem}>
                    <div className={styles.aRow}>
                        <div className={styles.label}>退货件数</div>
                        <div className={styles.label}>{orderDetail?.quantity}</div>
                    </div>
                </div>
                <div className={styles.formItem}>
                    <div className={styles.aRow}>
                        <div className={styles.label}>退款金额</div>
                        <div className={styles.label}>¥{handleRefundAmount(orderDetail)}</div>
                    </div>
                </div>
                <div className={styles.formItem}>
                    <div className={styles.aRow}>
                        <div className={styles.label}>退款原因</div>
                        {!currentName ? (
                            <div className={styles.right} onClick={() => setShowPopUp(true)}>
                                请选择退款原因{' '}
                                <img src='https://img.gzzhitu.com/zhitu-api/1746695810916.png' alt='' />
                            </div>
                        ) : (
                            <div className={styles.right1} onClick={() => setShowPopUp(true)}>
                                {currentName}{' '}
                                <img src='https://img.gzzhitu.com/zhitu-api/1746695810916.png' alt='' />
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.formItem}>
                    <div className={styles.label}>备注说明</div>
                    <div className={styles.input}>
                        <textarea
                            id='my-text-input'
                            className={styles['textarea-info']}
                            value={formData.reasonDetail}
                            placeholder={isFocus ? '' : '填写备注信息，100字以内'}
                            onChange={onChangeContent}
                            onTouchStart={onTextAreaFocus}
                            onFocus={() => {
                                setIsFocus(true);
                            }}
                            onBlur={() => {
                                setIsFocus(false);
                            }}
                            maxLength={100}
                        />
                    </div>
                </div>
                <div className={`${styles.formItem} ${styles['margin-43']}`}>
                    <div className={styles.label}>
                        上传凭证<span>（最多可上传3张）</span>
                    </div>
                    <div className={styles.up}>
                        {formData.proofPics.map((item, index) => (
                            <>
                                <div
                                    className={`${styles.upImg} ${formData.proofPics.length > 0 ? '' : styles.marginTop50}`}
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
                        {formData.proofPics.length < 3 && (
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
                <div className={styles.butDiv}>
                    <div className={styles.subButton} onClick={submit}>
                        申请退款
                    </div>
                </div>
            </div>
            {showPopUp && (
                <BottomPopup
                    defaultActive={refunId}
                    data={Number(type) === 1 ? Reason_refund_types1 : Reason_refund_types}
                    onConfirm={handleReasoRefund}
                    onCancel={handleCancel}
                    isApplFor={true}
                />
            )}
        </div>
    );
};

export default ApplyForRefund;

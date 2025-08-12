export interface FormDataType {
    /**
     * 订单号
     */
    orderId: string;
    /**
     * 售后类型：1-退货退款 2-仅退款
     */
    serviceType: number;
    /**
     * 退款原因类型：1-不想要了2-收货地址填错了3-与描述不符4-收到商品损坏了5-未按预定时间发货6-其他原因
     */
    reasonType: number;
    /**
     * 退款备注说明
     */
    reasonDetail: string;
    /**
     * 凭证图片地址
     */
    proofPics: string[];
}

export interface refundDetails {
    afterSaleId: string;
    serviceType: number; // 售后类型：1-退货退款 2-仅退款 3-换货
    afterSaleStatus: number; // 售后状态：售后状态：0-待处理 1-待退款 2-退款中 3-已完成 4-已拒绝 5-已取消
    returnStatus: number; // 退货状态：0-无需退货 1-待退货 2-已退货
    afterSaleTime: string;
    afterSaleStatusDesc: string;
    orderId: string;
    orderCreateTime: string;
    orderStatus: number; // 订单状态：0-待付款 1-待发货 2-待收货 3-已完成 4-已关闭 5 退款/售后
    orderStatusDesc: string;
    totalAmount: string;
    paymentAmount: string;
    freightPrice: string;
    discountAmount: string;
    afterSaleDeliveryCompany: string;
    afterSaleDeliverySn: string;
    reasonTypeDesc: string;
    reasonDetail: string;
    proofPics: string[];
    handleNote: string;
    handleTime: string;
    showCancel: boolean;
    returnDeadline: string;
    returnAddress: string;
    returnTime: string;
    refundAmount: string;
    gmtModified: string; // 最后更新时间
}

export interface OrderDetails {
    quantity: number;
    totalAmount: string;
    goodsImg: string;
    goodsName: string;
    paymentAmount: string;
    goodsPrice: string;
    freightPrice: string;
    orderStatus: number;
}

export interface FormReturnType {
    /**
     * 售后id
     */
    afterSaleId: string;
    /**
     * 快递公司
     */
    deliveryCompany: string;
    /**
     * 快递单号
     */
    deliverySn: string;
    /**
     * 退货留言
     */
    returnRemark: string;
    /**
     * 凭证图片地址
     */
    returnPics: string[];
}
export interface OssConfigType {
    StatusCode: string;
    AccessKeyId: string;
    AccessKeySecret: string;
    SecurityToken: string;
    Expiration: string;
    host: string;
    callback: string;
    privateBucket: string;
    bucket: string;
}
export interface FileType {
    name: string;
    size: number;
    type: string;
}

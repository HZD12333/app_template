export interface HistoryRecordItem {
    orderId: string; // 订单号
    orderCreateTime: string; // 下单时间
    orderStatus: number; // 订单状态（0-待付款 1-待发货 2-待收货 3-已完成 4-已关闭 5-退款/售后）
    orderStatusDesc: string; // 订单状态描述
    goodsName: string; // 商品名称
    goodsImg: string; // 商品图片
    quantity: number; // 购买数量
    goodsPrice: string; // 商品单价
    paymentAmount: string; // 实付金额
    showCancel: boolean; // 是否显示取消按钮
    afterSaleStatus: number;
    afterSaleId: string;
}

export interface ReceiverInfo {
    /**
     * 地址详情
     */
    addressDetail: string;
    /**
     * 联系人
     */
    contactName: string;
    /**
     * 联系手机
     */
    contactPhone: string;
}

export interface OrderDetail {
    /**
     * 物流公司
     */
    deliveryCompany: string;
    /**
     * 物流单号
     */
    deliverySn: string;
    /**
     * 顶部标题类型：
     * 1-待发货 2-待收货 3-已完成 4-已关闭 5-退款/售后处理中 6-退款成功交易关闭
     */
    detailTitleType: number;
    /**
     * 优惠金额
     */
    discountAmount: string;
    /**
     * 运费
     */
    freightPrice: string;
    /**
     * 商品图片
     */
    goodsImg: string;
    /**
     * 商品名称
     */
    goodsName: string;
    /**
     * 商品原价
     */
    goodsOriginalPrice: string;
    /**
     * 商品单价
     */
    goodsPrice: string;
    /**
     * 完成时间
     */
    orderCompleteTime: string;
    /**
     * 下单时间
     */
    orderCreateTime: string;
    /**
     * 订单号
     */
    orderId: string;
    /**
     * 支付时间
     */
    orderPaidTime: string;
    /**
     * 订单状态：0-待付款 1-待发货 2-待收货 3-已完成 4-已关闭 5 退款/售后
     */
    orderStatus: number;
    /**
     * 订单状态描述
     */
    orderStatusDesc: string;
    /**
     * 实付金额
     */
    paymentAmount: string;
    /**
     * 购买数量
     */
    quantity: number;
    /**
     * 收货信息
     */
    receiverInfo: ReceiverInfo;
    /**
     * 是否显示申请售后按钮
     */
    showAfterSale: boolean;
    /**
     * 是否显示历史售后详情按钮
     */
    showAfterSaleHistory: boolean;
    /**
     * 是否显示售后详情按钮
     */
    showAfterSaleInfo: boolean;
    /**
     * 是否显示取消订单按钮
     */
    showCancel: boolean;
    /**
     * 是否显示撤销售后按钮
     */
    showCancelAfterSale: boolean;
    /**
     * 是否显示确认收货按钮
     */
    showConfirm: boolean;
    /**
     * 订单总价
     */
    totalAmount: string;
}

export interface AfterSaleItem {
    afterSaleId: string; // 售后ID
    serviceType: '1' | '2'; // 售后类型：1-退货退款 2-仅退款
    afterSaleStatus: '0' | '1' | '2' | '3' | '4' | '5'; // 售后状态
    afterSaleStatusDesc: string; // 售后状态描述
    afterSaleTime: string; // 售后时间
    reasonTypeDesc: string; // 退款类型描述
}

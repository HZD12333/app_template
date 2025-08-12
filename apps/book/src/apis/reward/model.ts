export interface rewardDetailsItem {
    orderId: string;
    orderUserPhone: string;
    title: string;
    orderCreateTime: string;
    orderSettleTime: string;
    rewardStatus: number; // 1-未发 2-已发
    orderStatus: number; // 订单状态：1-已付款 3-已结算 4-已失效
    rewardAmount: string;
}
export interface orderAwardSummary {
    month: string;
    orderCount: string;
    awardInfo: string;
}

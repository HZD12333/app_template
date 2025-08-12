import { ApiProxy } from '@/services/http';

import type { orderAwardSummary, rewardDetailsItem } from './model';
/**
 * 获取订单详情
 */
export const getOrderAwardSummary = async (params: { selectMonth: number }) => {
    const [res] = await ApiProxy.request<{ list: orderAwardSummary[] }>(
        {
            type: 'post',
            url: '/gw/api/myshop/order/orderAwardSummary',
            loading: true,
        },
        params,
    );
    if (res) return res.list[0] || {};
};

/**
 * 获取奖励明细列表
 */
export const getOrderAwardList = (params: unknown) =>
    ApiProxy.request<{ list: rewardDetailsItem[]; hasNext: boolean }>(
        {
            type: 'post',
            url: '/gw/api/myshop/order/orderAwardList',
        },
        params,
    );

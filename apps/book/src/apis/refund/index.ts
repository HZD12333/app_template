import { ApiProxy } from '@/services/http';

import type { OrderDetails, refundDetails } from './model';

/**
 * 提交申请售后信息
 */
export const submitAfterSale = async (params?: unknown) => {
    return ApiProxy.request<{ code: number; message: string }>(
        {
            type: 'post',
            url: '/gw/api/myshop/order/submitAfterSale',
            deep: true,
            loading: true,
        },
        params,
    );
};

/**
 * 获取订单详情
 */
export const getOrderDetail = async (params: { orderId: string }) => {
    const [res] = await ApiProxy.request<OrderDetails>(
        {
            type: 'post',
            url: '/gw/api/myshop/order/detail',
            loading: true,
        },
        params,
    );
    if (res) return res || {};
};

export const getOssConfig = async () => {
    const [res] = await ApiProxy.request({
        type: 'post',
        url: '/api/system/oss/getKey',
    });
    if (res) return res || {};
};

/**
 * 提交填写退货信息
 */
export const submitReturnInfo = async (params?: unknown) => {
    return ApiProxy.request<{ code: number; message: string }>(
        {
            type: 'post',
            url: '/gw/api/myshop/order/submitReturnInfo',
            loading: true,
            deep: true,
        },
        params,
    );
};

/**
 * 获取售后详情
 */
export const getAfterSaleDetail = async (params: { orderId: string; afterSaleId: string }) => {
    const [res] = await ApiProxy.request<{ data: refundDetails; timestamp: number }>(
        {
            type: 'post',
            url: '/gw/api/myshop/order/afterSaleDetail',
            loading: true,
            deep: true,
        },
        params,
    );
    console.log(res);
    if (res) return res || [];
};

/**
 * 取消订单
 */
export const cancelAfterSale = async (params: { orderId: string }) => {
    return ApiProxy.request(
        {
            type: 'post',
            url: '/gw/api/myshop/order/cancelAfterSale',
            loading: true,
            deep: true,
        },
        params,
    );
};

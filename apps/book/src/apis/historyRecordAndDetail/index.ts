import { ApiProxy } from '@/services/http';

import type { AfterSaleItem, HistoryRecordItem, OrderDetail } from './model';

/**
 * 获取订单列表
 */
export const getOrderList = (params?: unknown) =>
    ApiProxy.request<{
        code: number;
        data: { list: HistoryRecordItem[]; hasNext: boolean };
        timestamp: number;
    }>(
        {
            type: 'post',
            url: '/gw/api/myshop/order/list',
            deep: true,
        },
        params,
    );

/**
 * 获取订单详情
 */
export const getOrderDetail = async (params?: unknown) => {
    const [res] = await ApiProxy.request<OrderDetail>(
        {
            type: 'post',
            url: '/gw/api/myshop/order/detail',
            loading: true,
        },
        params,
    );
    if (res) return res || {};
};

/**
 * 获取售后列表
 */
export const getAfterSaleList = async (params?: unknown) => {
    const [res] = await ApiProxy.request<AfterSaleItem[]>(
        {
            type: 'post',
            url: '/gw/api/myshop/order/afterSaleList',
            // loading: true,
        },
        params,
    );
    if (res) return res || [];
};

/**
 * 取消订单
 */
export const requestCancelOrder = async (params?: unknown) => {
    return ApiProxy.request<{ code: number; message: string }>(
        {
            type: 'post',
            url: '/gw/api/myshop/order/cancelOrder',
            loading: true,
        },
        params,
    );
};

/**
 * 确认收货
 */
export const requestConfirmReceipt = async (params?: unknown) => {
    return ApiProxy.request<{ code: number; message: string }>(
        {
            type: 'post',
            url: '/gw/api/myshop/order/confirmReceipt',
            loading: true,
        },
        params,
    );
};

export const requestCancelAfterSale = async (params?: unknown) => {
    return ApiProxy.request<{ code: number; message: string }>(
        {
            type: 'post',
            url: '/gw/api/myshop/order/cancelAfterSale',
            loading: true,
        },
        params,
    );
};

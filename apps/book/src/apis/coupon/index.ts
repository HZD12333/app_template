import { ApiProxy } from '@/services/http';

import type { couponItem } from './model';

/**
 * 获取优惠券列表
 */
export const getCouponList = (params: unknown) =>
    ApiProxy.request<{ data: couponItem[]; hasNext: boolean }>(
        {
            type: 'post',
            url: '/gw/api/myshop/coupon/list',
            deep: true,
        },
        params,
    );

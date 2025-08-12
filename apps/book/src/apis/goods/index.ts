import { ApiProxy } from '@/services/http';

import type { GoodsItem } from './model';

/**
 * 获取首页商品列表
 */
export interface IHomeGoodsParams {
    condition?: {
        /** 活动id，图书专区 1*/
        activityId?: number;
        /** 搜索关键字 */
        keyWord?: string;
    };
    order?: null | string;
    page?: number | null;
    rows?: number | null;
    sort?: null | string;
    [property: string]: any;
}
export const getHomeGoods = (params: IHomeGoodsParams) =>
    ApiProxy.request<{ dataList: GoodsItem[]; hasNext: boolean }>(
        {
            type: 'post',
            url: '/gw/api/myshop/goods/list',
            hideToast: true,
        },
        params,
    );

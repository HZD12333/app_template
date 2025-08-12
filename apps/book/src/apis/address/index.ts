import { ApiProxy } from '@/services/http';

import type { AddressItemModel } from './model';

/**
 * 获取收货地址列表
 */
export const getAddressList = (params?: unknown) =>
    ApiProxy.request<{ list: AddressItemModel[]; hasNext: boolean }>(
        {
            type: 'post',
            url: '/gw/api/myshop/order/addressList',
        },
        params,
    );

/**
 * 新建/保存收货地址
 */
export const updateAddress = (params: AddressItemModel) =>
    ApiProxy.request<{ addressId: string }>(
        {
            type: 'post',
            url: '/gw/api/myshop/order/addressSave',
            loading: true,
        },
        params,
    );

/**
 * 查询收货地址详情
 */
export const getAddressDetail = async (params: { addressId: string }) => {
    const [res] = await ApiProxy.request<{ list: AddressItemModel[] }>(
        {
            type: 'post',
            url: '/gw/api/myshop/order/addressList',
            loading: true,
        },
        params,
    );
    if (res) return res.list[0] || {};
};

/**
 * 删除地址
 */
export const deleteAddress = (params: { addressId: string }) =>
    ApiProxy.request<{ dataList: AddressItemModel[] }>(
        {
            type: 'post',
            url: '/gw/api/myshop/order/addressDelete',
            loading: true,
        },
        params,
    );

/**
 * 设置默认地址
 */
export const setDefaultAddress = (params: { addressId: string }) =>
    ApiProxy.request<{ dataList: AddressItemModel[] }>(
        {
            type: 'post',
            url: '/gw/api/myshop/order/addressSetDefault',
            loading: true,
        },
        params,
    );

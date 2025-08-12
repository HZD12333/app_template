import axios, { AxiosError, AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';

import { BaseAny } from '@miyuan/types';
import { toast } from '@miyuan/ui-omi';

import { requestInterceptor, rejectRespondInterceptor, fulfillRespondInterceptor } from './interceptors';
import { proxyUrl } from './proxyUrl';

/**
 * 根据传入的配置生成一个待处理的键
 * @param config cancelToken
 * @returns 返回由URL、方法、参数和数据组成的待处理键
 */
const getPendingKey = (config: AxiosRequestConfig<BaseAny>) => {
    let { url, method, params, data } = config;
    if (typeof data === 'string') data = JSON.parse(data || '{}'); // response里面返回的config.data是个字符串对象
    return [url, method, JSON.stringify(params), JSON.stringify(data || {})].join('&'); //将url请求路径，method方法，params参数，data参数以&连接起来进行
};

type UpdaterFn = (size: number) => void;

export interface RequestInterceptors {
    // 请求拦截
    requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig;
    requestInterceptorsCatch?: (err: AxiosError) => unknown;
    // 响应拦截
    responseInterceptors?: (config: AxiosResponse) => AxiosResponse;
    responseInterceptorsCatch?: (err: AxiosError) => unknown;
}
// 自定义传入的参数
export interface RequestConfig extends AxiosRequestConfig {
    interceptors?: RequestInterceptors;
    updater?: UpdaterFn;
}

type RequestOptions = {
    /** 请求类型 */
    type: 'get' | 'post' | 'put' | 'delete' | 'head';
    /** 请求地址 */
    url: string;
    /** 是否直接返回后端原始数据 */
    deep?: boolean;
    /** 是否自动显示加载中 */
    loading?: boolean;
    /** 是否隐藏toast */
    hideToast?: boolean;
};

/**
 * axios请求实例
 */
class Request {
    instance: AxiosInstance;
    pendingMap = new Map();
    updateSize?: UpdaterFn;

    constructor(options?: RequestConfig) {
        const { updater, ...rest } = options || {};
        if (updater) this.updateSize = updater;

        this.instance = axios.create({ timeout: 60 * 1000, ...rest });
        // 请求拦截器
        this.instance.interceptors.request.use((config) => {
            const { loading } = config.fetchOptions || {};
            if (loading) {
                this.removePending(config); //移除重复的请求
                this.addPending(config); //将新的请求添加进去
            }
            return requestInterceptor(config);
        });

        // 响应拦截器
        this.instance.interceptors.response.use((res: AxiosResponse) => {
            const { loading } = res.config.fetchOptions || {};
            if (loading) {
                this.removePending(res.config);
            }

            return fulfillRespondInterceptor(res);
        }, rejectRespondInterceptor);
    }

    /**
     * 将当前请求加入请求池中，并添加一个取消函数
     */
    addPending(config: AxiosRequestConfig<BaseAny>) {
        const pendingKey = getPendingKey(config);
        config.cancelToken =
            config.cancelToken ||
            new axios.CancelToken((cancel) => {
                //axios 取消请求（axios中取消请求情况分为1：取消该请求之后的相同请求；2：取消该请求之前的相同请求）
                if (!this.pendingMap.has(pendingKey)) {
                    this.pendingMap.set(pendingKey, cancel);
                    this.updateSize?.(this.pendingMap.size); //记录请求池中请求的数量
                }
            });
    }

    /**
     * 从请求池中移除当前请求，并取消该请求
     */
    removePending(config: AxiosRequestConfig<BaseAny>) {
        const pendingKey = getPendingKey(config);

        if (this.pendingMap.has(pendingKey)) {
            const cancelToken = this.pendingMap.get(pendingKey);
            cancelToken(pendingKey); //如果请求过则取消请求
            this.pendingMap.delete(pendingKey);
            const id = setTimeout(() => {
                this.updateSize?.(this.pendingMap.size);
                clearTimeout(id);
            }, 60);
        }
    }

    request<R = BaseAny>(options: RequestOptions, params?: BaseAny, config?: AxiosRequestConfig<BaseAny>) {
        const { url, type, deep, ...fetchOptions } = options;

        const targetUrl = proxyUrl(url);
        const requestConfig = { ...config, fetchOptions };

        let instance: AxiosPromise;
        switch (type) {
            case 'post':
            case 'put':
                instance = this.instance[type](targetUrl, params, requestConfig);
                break;
            case 'get':
            case 'delete':
            case 'head':
            default:
                instance = this.instance[type](targetUrl, Object.assign({}, requestConfig, { params }));
                break;
        }

        return instance
            .then((res: any) => [(deep ? res : res.data) as R | null])
            .catch((err: any) => {
                const { loading, hideToast } = fetchOptions || {};

                if (loading && err.response) {
                    this.removePending(err.response.config);
                }

                if (!hideToast) {
                    toast(err.msg || '请求出错');
                }

                return [null, err] as unknown as Promise<[R | null, AxiosError]>;
            });
    }
}

export default Request;

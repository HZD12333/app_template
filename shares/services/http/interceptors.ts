import { toast } from '@miyuan/ui-omi';
import { getAuthHeader, parseQuery } from '@miyuan/utils';

import { httpRequestCapture } from '../sentry';

import { HTTP_STATUS, BUSINESS_CODE } from './config';

const isGray = window.location.pathname?.includes('gray');

export const requestInterceptor = (config) => {
    const api_token = sessionStorage.getItem('token') || '';
    const { appVersion = '' } = parseQuery();

    const headers = {
        version: '1.0.0',
        userAgent: '',
        versionCode: appVersion,
        appVersionCode: appVersion,
        grayReleaseTag: isGray ? 'gray' : '',
        isGrayRelease: isGray,
        ...getAuthHeader(api_token),
    };

    config.headers = headers;
    return config;
};

export const rejectRespondInterceptor = (error) => {
    if (error.response) {
        switch (error.response.status) {
            case HTTP_STATUS.NOT_FOUND:
                toast('请求资源不存在');
                break;
            case HTTP_STATUS.BAD_GATEWAY:
                toast('服务端出现了问题');
                break;
            case HTTP_STATUS.FORBIDDEN:
            case HTTP_STATUS.AUTHENTICATE:
                toast('没有权限访问');
                break;
            default:
                toast('请求出错');
        }
    } else {
        console.log('error', error);
        toast('网络错误');
    }
    return Promise.reject(error);
};

export const fulfillRespondInterceptor = (res) => {
    const data = res.data;

    if (![BUSINESS_CODE.COMPLETE, BUSINESS_CODE.COMPLETE2].includes(data.code)) {
        httpRequestCapture(data, res);
    }

    switch (data.code) {
        case BUSINESS_CODE.COMPLETE:
        case BUSINESS_CODE.COMPLETE2:
            return data;
        default:
            return Promise.reject(data);
    }
};

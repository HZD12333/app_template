import { ApiProxy } from '@/services/http';

/**
 * 通过Key获取阿波罗对应的配置信息
 * @param key 找后端要
 * @returns { Object }
 */
export async function getConfigForKey(key: string, type?: 'string' | 'object') {
    const [res] = await ApiProxy.request<{ sysValue: string }>(
        {
            url: '/api/system/getConfigForKey',
            type: 'post',
        },
        { key },
    );
    return type === 'string' ? res?.sysValue : JSON.parse(res?.sysValue || '{}');
}

/**
 * 通过Key获取阿波罗对应的配置信息
 * @param key 找后端要
 * @returns { Object }
 */
export async function getConfigForKeyApollo(key: string) {
    const [res] = await ApiProxy.request<{ sysValue: string }>(
        {
            url: '/api/system/apollo/config/get',
            type: 'post',
        },
        { keys: [key] },
    );
    return JSON.parse(res?.[0].sysValue || '{}');
}

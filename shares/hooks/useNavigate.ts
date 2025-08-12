import { useCallback } from 'react';
import { useNavigate as useRouterNavigate } from 'react-router-dom';

import { useGetExternal } from '@miyuan/hooks';
import { goSuperEntrance } from '@miyuan/native-apis';
import { FnType, Recordable } from '@miyuan/types';
import { isMiyuan, parseQuery, stringifyQuery } from '@miyuan/utils';

/**
 * 在蜜源应用中导航到指定路径
 * @param path 要导航到的路径。如果包含 'http'，则视为绝对路径；否则视为相对路径
 */
export const navigateInMiyuan = (path: string) => {
    const { origin, pathname } = window.location;
    const url = path.includes('http') ? path : `${origin + pathname}#${path}`;

    if (!isMiyuan()) {
        window.location.href = url;
    }

    const obj = {
        title: '',
        url,
        type: 41,
        open: 3,
    };
    goSuperEntrance(obj);
};

/**
 * 跳转到指定小程序
 * @param url 小程序路径
 * @param appletsId 小程序原始ID
 */
export const navigateToMiniApp = (url: string, appletsId: string) =>
    goSuperEntrance({
        title: '',
        url, // 小程序路径
        open: 14, // 打开小程序方式
        appletsId, // 小程序原始ID
    });

export const getOmitQuery = (params: Recordable) => {
    const query = parseQuery();
    const obj = {};

    for (const key in query) {
        if (key && params[key] === undefined) {
            obj[key] = query[key];
        }
    }

    return obj;
};

interface INavigateOptions {
    // 是否需要登录
    checkLogin?: (onSuccess?: FnType) => Promise<boolean>;
    // 跳转时是否需要带上自定义参数
    query?: Recordable;
    // 直接用history跳转
    useHistory?: boolean;
    // 携带当前query参数跳转, 默认false
    appendQuery?: boolean;
}

export type NavigateFn = (path?: string, options?: INavigateOptions) => void;

/**
 * 导航hook
 * * 自动处理端内端外跳转
 * @returns 返回一个导航函数，用于页面跳转
 */
export function useNavigate() {
    const routerNavigate = useRouterNavigate();
    const isExternal = useGetExternal();

    const navigate = useCallback<NavigateFn>(
        (path, options) => {
            if (!path) return;

            const { checkLogin, query = {}, useHistory, appendQuery = false } = options || {};

            const success = () => {
                if (isExternal || useHistory) {
                    let params = query;

                    if (appendQuery) {
                        const omitQuery = getOmitQuery(query);
                        params = { ...omitQuery, ...query };
                    }

                    let search = stringifyQuery(params);

                    if (path.includes('?')) {
                        search = search.replace('?', path.endsWith('?') ? '' : '&');
                    }

                    const url = `${path}${search}`;

                    if (path.includes('http')) {
                        window.location.href = url;
                        return;
                    }

                    routerNavigate(url);
                    return;
                }

                navigateInMiyuan(path);
            };

            if (checkLogin) {
                checkLogin(success);
            } else {
                success();
            }
        },
        [routerNavigate, isExternal],
    );

    return navigate;
}

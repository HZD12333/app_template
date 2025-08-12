import { useEffect, useState, useCallback } from 'react';

import { getUserInfo } from '@miyuan/helpers';
import { ActionGuard, createCheckLoginPlugin } from '@miyuan/service';
import { FnType, Nullable, Recordable } from '@miyuan/types';

const request = async () => {
    const res = await getUserInfo();
    return Boolean(res?.inviteCode);
};

const checkLoginPlugin = createCheckLoginPlugin({ request });

const plugin = new ActionGuard({ plugins: [checkLoginPlugin] });

type IUserInfo = {
    hasLogin: boolean;
    inviteCode: string;
    userInfo: Record<string, any>;
};

export type CheckLoginFn = (onSuccess?: FnType) => Promise<boolean>;

export type ReturnType = IUserInfo & {
    /** 已登录自动触发回调；未登录弹窗提示登录，点确定自动跳登录页 */
    checkLogin: CheckLoginFn;
};

/**
 * 获取用户信息并处理登录状态的自定义 Hook
 * @returns 包含用户信息和登录检查方法的对象
 * @example const { hasLogin, userInfo, inviteCode, checkLogin } = useUserInfo();
 * @example checkLogin(() => console.log('登录成功'));
 */
export function useUserInfo(): ReturnType {
    const [loginInfo, setLoginInfo] = useState({} as IUserInfo);

    const formatInfo = useCallback((userInfo: Nullable<Recordable>) => {
        if (!userInfo) return;

        setLoginInfo({
            hasLogin: Boolean(userInfo),
            userInfo,
            inviteCode: userInfo.inviteCode,
        });
    }, []);

    const checkLogin = useCallback((onSuccess?: FnType) => plugin.guard({ name: 'login' }, onSuccess), []);

    useEffect(() => {
        getUserInfo().then((info: Nullable<Recordable>) => {
            formatInfo(info);
        });
    }, []);

    return {
        ...loginInfo,
        checkLogin,
    };
}

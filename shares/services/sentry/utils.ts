import * as Sentry from '@sentry/react';
import { v1 } from 'uuid';

import { getUserInfo } from '@miyuan/helpers';

export async function setUserConfig() {
    const userInfo = await getUserInfo();

    if (userInfo) {
        Sentry.setUser({
            id: userInfo.id,
            email: '',
            username: userInfo.nickname,
            inviteCode: userInfo.inviteCode,
        });
        Sentry.setTag('uid', userInfo.id);
        Sentry.setTag('inviteCode', userInfo.inviteCode);
    }

    // 设置当前访问的 Session ID, 用于追踪用户本次访问的错误
    Sentry.setTag('session_id', v1());
}

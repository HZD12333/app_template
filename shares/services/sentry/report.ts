import * as Sentry from '@sentry/react';

import { eErrorType } from '@miyuan/enums';

import type { AxiosResponse } from 'axios';

/** 手动上报错误 */
export const manualCapture = (messageOrError: Error | string) => {
    const error = messageOrError instanceof Error ? messageOrError : new Error(messageOrError);
    Sentry.captureException(error, (scope) => {
        scope.setTag('errorType', 'scriptReport');
        scope.setTag('type', eErrorType.INTERACTION);
        scope.addBreadcrumb({
            type: 'error',
            category: 'stack',
            message: error.stack?.slice(0, 300),
        });
        scope.setLevel('info');

        return scope;
    });
};

/** 接口错误上报 */
export function httpRequestCapture(rejection: Error | Record<string, any>, response: AxiosResponse<any>) {
    const { config, data, status } = response || (rejection as any).origin.response || {};
    const { url, method } = config || {};
    const { code, msg } = data || {};

    Sentry.captureException(rejection, (scope) => {
        scope.setTag('type', eErrorType.HTTP);
        scope.setExtras({ code, message: msg });
        scope.addBreadcrumb({
            type: 'error',
            category: 'xhr',
            message: `${method?.toUpperCase()} ${url} [${status}]`,
        });
        scope.setLevel('error');

        return scope;
    });
}

/** 手动上报错误 */
export const renderCapture = (error: Error) => {
    Sentry.captureException(error, (scope) => {
        scope.setTag('errorType', 'renderError');
        scope.setTag('type', eErrorType.RENDER);
        scope.addBreadcrumb({
            type: 'error',
            category: 'stack',
            message: error.stack?.slice(0, 300),
        });
        scope.setLevel('error');
        return scope;
    });
};

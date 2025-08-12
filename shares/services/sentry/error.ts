import * as Sentry from '@sentry/react';

import { eErrorType } from '@miyuan/enums';

interface IOptions {
    /** 错误标题 默认为交互异常信息 */
    name?: string;
    /** 解决sentry归类问题，避免覆盖 */
    stack?: string;
}

/**
 * 创建自定义 Error
 * @param message 错误信息
 * @param options
 */
export function newCustomError(message: string, options?: IOptions) {
    const { name = 'CustomError', stack } = options || {};
    const err = new Error();
    err.name = name;
    err.message = message;

    if (stack) err.stack = stack;

    return err;
}

/**
 * 自定义抛出 Error
 * @param name 错误标题 默认为交互异常信息
 * @param message 错误信息
 */
export function throwError(message: string, isSocket?: boolean, name?: string) {
    const error = newCustomError(message, { name });

    Sentry.captureException(error, (scope) => {
        scope.setTag('type', eErrorType.INTERACTION);
        if (isSocket) {
            scope.setTag('socket', true);
        }
        return scope;
    });

    /* eslint-disable no-console  */
    console.error(error);
}

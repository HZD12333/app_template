import * as Sentry from '@sentry/react';

import { eErrorType } from '@miyuan/enums';
import { readJsonConfig } from '@miyuan/helpers';
import { SimpleStorage } from '@miyuan/utils';

import { setUserConfig } from './utils';

export * from './report';
export * from './error';

// 获取过滤条件配置
let FILTER_SET = [];
async function readIgnoreConfig() {
    const storage = new SimpleStorage('web_sentry_ignore');
    const cacheIgnoreList = storage.value;

    if (cacheIgnoreList.length) {
        FILTER_SET = cacheIgnoreList;
    }

    const res = await readJsonConfig('https://img.gzzhitu.com/h5-config/douquan/sentry.json');
    if (res) {
        FILTER_SET = res;
        storage.value = res;
    }
}

/** 判断报错信息是否需要过滤 */
const needIgnore = (message: string) => FILTER_SET.some((item) => message.indexOf(item) !== -1);

/**
 * sentry面包屑处理
 */
const beforeBreadcrumb = (breadcrumb, hint) => {
    switch (breadcrumb.category) {
        // 过滤 CONSOLE LOG WARN
        case 'console': {
            if (hint?.level !== 'error') return null;

            break;
        }

        // XHR 添加数据
        case 'xhr': {
            // 设置 traceid
            break;
        }

        // 用户操作
        case 'ui.click': {
            const { event } = hint || {};
            const target: HTMLElement = event.target;
            const content = target.innerText || '';
            if (content) {
                breadcrumb.data = Object.assign(breadcrumb.data || {}, {
                    content: content.slice(0, 6),
                });
            }

            break;
        }
    }

    return breadcrumb;
};

/**
 * sentry上报前钩子函数
 */
const beforeSend = (event) => {
    // 过滤非错误类型
    if (!event.exception) return null;

    const exception = event.exception.values[0];

    // 不存在message或者符合自定义过滤
    if (needIgnore(exception)) {
        return null;
    }

    switch (exception.type) {
        case 'UnhandledRejection':
            if (exception.value.indexOf('Non-Error promise rejection') !== -1) return null;
            break;
        case 'Error':
            if (exception.value.indexOf('Non-Error exception') !== -1) return null;
            break;
        case 'CustomError':
            //
            break;
        default:
            break;
    }

    if (event.tags && !event.tags['type']) {
        event.tags['errorType'] = exception.type;
        event.tags['type'] = eErrorType.JS;
    }

    return event;
};

export function initSentry(options: Partial<Sentry.BrowserOptions>) {
    try {
        readIgnoreConfig();

        Sentry.init({
            /** SDK 上报地址 */
            dsn: __CONFIG__.SENTRY_DSN,
            /** 开启 DEBUG 模式 */
            debug: process.env.NODE_ENV !== 'production',
            /** 代码的版本号 Release 版本号, 可以确定当前的错误/异常属于哪一个发布的版本 */
            release: process.env.GIT_COMMIT_HASH || '',
            /** 上报当前错误/异常发生的环境 */
            environment: __GLOBAL_ENV__.IS_PRODUCTION ? 'production' : 'test',
            // 控制给定事务发送到 Sentry 的概率百分比。0 表示 0%，1 表示 100%
            tracesSampleRate: 1,
            beforeBreadcrumb,
            beforeSend,
            replaysSessionSampleRate: 0,
            replaysOnErrorSampleRate: 1,
            integrations: [
                Sentry.browserTracingIntegration(),
                Sentry.replayIntegration({
                    // Additional SDK configuration goes in here, for example:
                    maskAllText: false,
                    blockAllMedia: false,
                    maskAllInputs: false,
                    networkDetailAllowUrls: ['api.gzmiyuan.com'],
                }),
            ],
            ...options,
        });

        setUserConfig();
    } catch (e) {
        console.error(e);
    }
}

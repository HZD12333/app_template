const enum eRunEnv {
    Dev = 'dev',
    Uat01 = 'uat01',
    Uat02 = 'uat02',
    Prod = 'prod',
    Gray = 'gray',
}

/** 生产环境 */
const prod = {
    DOMAIN: 'gzmiyuan.com',
    MIYUAN_DOMAIN: 'https://api.gzmiyuan.com/gw', // 新架构域名
    OLD_MIYUAN_DOMAIN: 'https://api.gzmiyuan.com', // 旧架构域名
    MONITOR_URL: 'https://api.gzmiyuan.com/gw/api/reporter/targetMonitor',
    MIYUAN_TRACK_URL: 'https://bury.gzmiyuan.com/h5',
    CDN_PATH: 'https://static.gzmiyuan.com/api/h5',
};

/** 灰度环境 */
const gray = {
    DOMAIN: 'gzmiyuan.com',
    MIYUAN_DOMAIN: 'https://api.gzmiyuan.com/gw', // 新架构域名
    OLD_MIYUAN_DOMAIN: 'https://api.gzmiyuan.com', // 旧架构域名
    MONITOR_URL: 'https://api.gzmiyuan.com/gw/api/reporter/targetMonitor',
    MIYUAN_TRACK_URL: 'https://bury.gzmiyuan.com/h5',
    CDN_PATH: 'https://static.gzmiyuan.com/api/h5',
};

/** 测试环境 */
const uat = (mode: string) => ({
    DOMAIN: 'gzmiyuan.com',
    MIYUAN_DOMAIN: `https://${mode}.gzmiyuan.com/gw`, // 新架构域名
    OLD_MIYUAN_DOMAIN: `https://${mode}.gzmiyuan.com`, // 旧架构域名
    MONITOR_URL: `https://${mode}.gzmiyuan.com/gw/api/reporter/targetMonitor`,
    MIYUAN_TRACK_URL: 'https://uat-bury.gzmiyuan.com/h5',
    CDN_PATH: 'https://static.gzmiyuan.com/api/h5',
});

export function mergeConfig<T extends Record<string, unknown>>(mode: string, options: T = {} as T) {
    const common = {
        ...options,
    };

    if (mode === eRunEnv.Prod) {
        return Object.assign({}, common, prod);
    }

    if (mode === eRunEnv.Gray) {
        return Object.assign({}, common, gray);
    }

    if (mode === eRunEnv.Dev) {
        return Object.assign({}, common, uat(eRunEnv.Uat01));
    }

    return Object.assign({}, common, uat(mode));
}

export const defineEnvVariable = (mode: string): RunEnv => {
    const isLocal = mode === eRunEnv.Dev;
    const isTest = mode.includes('uat') || isLocal;

    return {
        RUN_ENV: mode,
        IS_PRODUCTION: mode === eRunEnv.Prod,
        IS_TEST: isTest,
        IS_LOCAL_TEST: isLocal,
        IS_GRAY: mode === eRunEnv.Gray,
    };
};

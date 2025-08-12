import { MockServer } from '@miyuan/service';

import Request from '@shares/services/http';

import { useGlobalStore } from '@/store/common';

// 获取本地mock配置
if (process.env.NODE_ENV === 'development') {
    const getConfigFile = async () => {
        try {
            const filePath = '../../../.mockrc';
            const module = await import(/* @vite-ignore */ filePath);
            return module.default;
        } catch (error) {
            console.error('模块加载失败', error);
        }
    };
    MockServer.initConfig(getConfigFile);
}

const ApiProxy = new Request({
    updater(size) {
        useGlobalStore.setState({ loading: !!size }); //记录请求池中请求的数量
    },
});

export { ApiProxy };

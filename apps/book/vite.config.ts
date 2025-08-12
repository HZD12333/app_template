import { execSync } from 'child_process';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import { createHtmlPlugin } from 'vite-plugin-html';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';
import { resolve as _resolve } from 'path';
import ViteAssetsRetry from '@miyuan/assets-retry-plugin/dist/vite';
import { postHtml } from '../../shares/vite-plugins/post-html';
import pxtorem from 'postcss-pxtorem';

import { PROJECT_CONFIG, V_CONSOLE_DSN } from './_config';
import { defineEnvVariable, mergeConfig } from './_env';
import projectPackage from './package.json';

import type { PluginOption } from 'vite';

const buildWithAnalysis = false;

const SPLIT_CHUNKS = [
    {
        name: 'crypto-js',
        version: '@4.1.1',
    },
    {
        name: 'zod',
        version: '@3.25.30',
    },
    {
        name: 'axios',
        version: '@1.9.0',
    },
    {
        name: 'sentry',
        version: '@7.50.0',
    },
    {
        name: 'react',
        version: '@18.3.1',
        test: '/react',
    },
    {
        name: 'antd-mobile',
        version: '@5.39.0'
    },
]

function getGitHash() {
    try {
        return JSON.stringify(
            execSync('git rev-parse --short HEAD', { encoding: 'utf8', maxBuffer: 52428800 }).toString(),
        ).replace('\\n', '');
    } catch (_) {
        return '';
    }
}

const resolve = (p: string) => _resolve(__dirname, p);

export default defineConfig(({ mode }) => {
    const runEnv = defineEnvVariable(mode);
    const globalConfig = mergeConfig<typeof PROJECT_CONFIG>(mode, PROJECT_CONFIG);
    const isProduction = runEnv.IS_PRODUCTION && process.env.NODE_ENV === 'production';
    const isGray =  runEnv.IS_GRAY && process.env.NODE_ENV === 'production';

    const plugins: PluginOption[] = [
        react({
            babel: {
                presets: [['@babel/preset-typescript'], ['@babel/preset-env', { modules: false }]],
                plugins: [
                    ['@babel/plugin-transform-typescript', { allowDeclareFields: true }],
                    ['import', { libraryName: 'antd-mobile', style: 'css' }, 'antd-mobile'],
                ],
            },
        }),
        createHtmlPlugin({
            minify: true,
            /**  在这里写entry后，你将不需要在`index.html`内添加 script 标签 */
            entry: 'src/app.tsx',
            /** 需要注入 index.html ejs 模版的数据 */
            inject: {
                data: {
                    PROJECT_TITLE: globalConfig.PROJECT_TITLE,
                    V_CONSOLE_SCRIPT: runEnv.IS_TEST ? V_CONSOLE_DSN : undefined,
                },
            },
        }),
        viteCompression({
            verbose: false
        }),
        ViteAssetsRetry({
            maxRetryCount: 2,
            sentry: {
                dsn: globalConfig.SENTRY_DSN,
                environment: isProduction ? 'production' : 'test',
            },
            domain: {
                'static.gzmiyuan.com': 'static-tc.gzmiyuan.com',
                'static-tc.gzmiyuan.com': 'static.gzmiyuan.com',
                'img.gzzhitu.com': 'img.gzmiyuan.com'
            },
        }),
    ];

    if (buildWithAnalysis) {
        plugins.push(
            visualizer({
                emitFile: false,
                filename: resolve(`${globalConfig.BUNDLE_PATH}/analysis-chart.html`),
                open: true,
            }),
        );
    }

    if (isProduction || isGray) {
        // 生成 ES polyfill
        plugins.push(legacy({ targets: ['defaults', 'not IE 11'] }));
    } else {
        // 资源路径处理
        plugins.push(postHtml(projectPackage.name));
    }

    return {
        plugins,
        css: {
            postcss: {
                plugins: [
                    pxtorem({
                        rootValue: 75, // 1rem 的大小，可以根据设计稿进行调整
                        unitPrecision: 5,
                        propList: ['*'], // 需要转换的属性，'*' 表示全部转换
                        exclude: /(node_module)/,
                    }),
                ],
            },
            preprocessorOptions: {
                less: {
                    additionalData: `@import '../../shares/styles/global.less';`,
                },
            },
        },
        server: {
            host: true,
            port: 3001,
            proxy: {
                '/api': {
                    target: globalConfig.OLD_MIYUAN_DOMAIN,
                    changeOrigin: true,
                    headers: {
                        origin: globalConfig.OLD_MIYUAN_DOMAIN,
                    },
                },
                '/gw': {
                    target: globalConfig.MIYUAN_DOMAIN,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/gw/, ''),
                },
            },
        },
        define: {
            __GLOBAL_ENV__: runEnv,
            __CONFIG__: globalConfig,
            'process.env.GIT_COMMIT_HASH': getGitHash(),
        },
        resolve: {
            alias: {
                '@': resolve('src'),
                '@shares': resolve('../../shares'),
            },
        },
        base: isProduction ? globalConfig.CDN_PATH : './',
        build: {
            sourcemap: !isProduction,
            manifest: true,
            outDir: resolve(globalConfig.BUNDLE_PATH),
            assetsDir: globalConfig.JS_BUNDLE_NAME,
            rollupOptions: {
                output: {
                    manualChunks: id => {
                        if (id.includes('node_modules')) {
                            const module = SPLIT_CHUNKS.find(item => id.includes(item.test || item.name));
                            if (module) {
                                return module.name
                            }

                            if (id.includes('use-gesture')) return 'use-gesture';

                            return id.split('node_modules/.pnpm/')[1].split('@')[0];
                        }
                    },
                    chunkFileNames: (chunkInfo) => {
                        const module = SPLIT_CHUNKS.find(item => item.name === chunkInfo.name);
                        if (module) return `${globalConfig.JS_DLL_NAME}/${module.name}-${module.version}.js`
                        return `${globalConfig.JS_BUNDLE_NAME}/[name]-[hash].js`
                    }
                },
            },
        },
    };
});

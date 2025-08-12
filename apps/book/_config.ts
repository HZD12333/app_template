import packageJson from './package.json';

export const PROJECT_CONFIG = {
    PROJECT_TITLE: '\u200E',
    PROJECT_NAME: packageJson.name,
    SENTRY_DSN: 'https://032706ce16b17a4c0f204fd3cd54da03@sentry.gzmiyuan.com/13',
    BUNDLE_PATH: `../../dist`,
    JS_BUNDLE_NAME: `${packageJson.name}/js`,
    JS_DLL_NAME: 'common-dll',
};

export const V_CONSOLE_DSN = `<script src='https://img.gzzhitu.com/zhitu-api/1694760203472984.js'></script>
<script>new VConsole();</script>`;

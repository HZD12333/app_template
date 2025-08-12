import ReactDOM from 'react-dom/client';

import { parseQuery } from '@miyuan/utils';

import { Loading, ErrorBoundary } from '@shares/components';
import { initSentry } from '@shares/services/sentry';

import { useGlobalStore } from '@/store/common';

import AppRoutes from './routes';

// 页面适配
import 'lib-flexible';

import 'antd-mobile/es/global';

import '@shares/styles/common.less';

import './define-web-component';

const App = () => {
    const { loading } = useGlobalStore();

    return (
        <ErrorBoundary>
            <AppRoutes />
            {loading && <Loading />}
        </ErrorBoundary>
    );
};

const renderApp = () => {
    const { token, inviteCode } = parseQuery();

    if (inviteCode && token) {
        sessionStorage.setItem('token', token);
    }

    if (__GLOBAL_ENV__.IS_PRODUCTION) {
        setTimeout(initSentry, 0);
    }

    ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
};

renderApp();

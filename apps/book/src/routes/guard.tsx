import React, { Suspense } from 'react';

import { androidScrollPolyfill } from '@miyuan/helpers';
import { setAppRefresh } from '@miyuan/native-apis';
import { setHeadTitle } from '@miyuan/utils';

import { Loading } from '@shares/components';

import { type IRouteConfig } from './utils';

interface IGuardProps {
    component: React.LazyExoticComponent<any>;
    route: IRouteConfig;
}
export const Guard: React.FC<IGuardProps> = (props) => {
    const { component: Component, route, ...rest } = props;
    const { meta } = route;

    if (!meta.disablePullDownRefresh) {
        setAppRefresh(1);
        androidScrollPolyfill();
    } else {
        setAppRefresh(0);
    }

    if (meta.title) {
        setHeadTitle(meta.title);
    }

    return (
        <Suspense fallback={<Loading />}>
            <Component {...rest} />
        </Suspense>
    );
};

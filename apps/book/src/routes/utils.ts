/*
 * @Author: huangzhendong huangzhendong@dingtalk.com
 * @Date: 2025-08-12 11:32:02
 * @LastEditors: huangzhendong huangzhendong@dingtalk.com
 * @LastEditTime: 2025-08-12 11:44:45
 * @FilePath: \app_template\apps\book\src\routes\utils.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { lazy, LazyExoticComponent, FC } from 'react';
import { PathRouteProps } from 'react-router-dom';

import { BaseAny } from '@miyuan/types';

interface IMetaProps {
    title?: string;
    /** 埋点的页面唯一标识 */
    pageId?: string;
    /** 禁用页面下拉刷新 */
    disablePullDownRefresh?: boolean;
}

export interface IRouteConfig extends PathRouteProps {
    meta: IMetaProps;
    component: LazyExoticComponent<FC>;
    skeleton?: React.ReactNode;
}

/**
 * 生成路由配置
 * @returns 路由配置数组
 */
export const generateRoutes = () => {
    const pages = import.meta.glob('../pages/**/index.config.ts', { eager: true, import: 'default' });
    const components = import.meta.glob('../pages/**/index.tsx');

    const routes = Object.entries(pages).map(([path, meta]) => {
        const compPath = path.replace('index.config.ts', 'index.tsx');
        path = path.replace('../pages', '').replace('/index.config.ts', '') || '/';
        const name = path.split('/').filter(Boolean).join('-') || 'index';

        return {
            path,
            name,
            component: lazy(components[compPath] as BaseAny),
            meta,
        };
    });
    console.log(121221, routes);
    return routes as IRouteConfig[];
};

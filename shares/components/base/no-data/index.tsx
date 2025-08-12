import classNames from 'classnames';
import React from 'react';

import { ComponentBaseProps } from '@miyuan/types';

import { NO_SEARCH_DATA_IMG, NO_ORDER_IMG, NO_DATA_IMG } from '@shares/constants/image';

import './index.less';

export enum eNoDataType {
    Search,
    Order,
    Normal,
}

const NoDataMap = {
    [eNoDataType.Search]: NO_SEARCH_DATA_IMG,
    [eNoDataType.Order]: NO_ORDER_IMG,
    [eNoDataType.Normal]: NO_DATA_IMG,
};

export interface INoDataProps extends ComponentBaseProps {
    text?: React.ReactNode | string;
    type?: eNoDataType;
    iconUrl?: string;
    size?: 'small' | 'default';
}

export function NoData(props: INoDataProps) {
    const {
        text = '暂无数据～',
        size = 'default',
        type = eNoDataType.Normal,
        iconUrl,
        className,
        style,
    } = props;

    const icon = iconUrl ? iconUrl : NoDataMap[type];

    return (
        <div className={classNames('my-no-data', className)} style={style}>
            <img className={classNames('my-no-data-icon', size)} src={icon} alt='' />
            {text}
        </div>
    );
}

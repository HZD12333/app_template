import classNames from 'classnames';
import React from 'react';

import { ComponentBaseProps } from '@miyuan/types';

import { px2rem } from '@shares/utils';

import './index.less';

interface MoneyProps extends ComponentBaseProps {
    /** 金额值 */
    value?: string | number;
    /** 金额和¥的字体大小，第一次为金额，第二位¥ */
    sizes?: number[];
    /** 金额值 */
    color?: string;
}

const _Money: React.FC<MoneyProps> = (props) => {
    const { value, className, sizes = [], color } = props;

    const valueStyle = { fontSize: sizes[0] ? px2rem(sizes[0]) : undefined, color };
    const signStyle = { fontSize: sizes[1] ? px2rem(sizes[1]) : undefined };

    if (!value) return null;

    return (
        <span className={classNames('my-money', className)} style={valueStyle}>
            <span className='sign' style={signStyle}>
                ¥
            </span>
            {value}
        </span>
    );
};

export const Money = React.memo(_Money);

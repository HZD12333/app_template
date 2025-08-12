import classNames from 'classnames';

import { ComponentBaseProps, FnType } from '@miyuan/types';

import { px2rem } from '@shares/utils';

import './index.less';

export interface ButtonProps extends ComponentBaseProps {
    /** 按钮大小 默认：large */
    size?: 'mini' | 'default';
    /** 按钮类型 默认：无 */
    type?: 'primary' | 'second' | 'dark';
    /** 是否禁用 默认：false */
    disabled?: boolean;
    /** 按钮宽度 默认：100% */
    width?: number;
    /** 文案前置icon */
    icon?: React.ReactNode;
    /** loading状态 */
    loading?: boolean;
    onClick?: FnType;
}

const Button: React.FC<ButtonProps> = (props) => {
    const {
        children,
        type = 'default',
        size = 'default',
        disabled,
        width,
        onClick,
        className,
        style,
    } = props;

    const classes = classNames(
        'my-button',
        {
            [`t-${type}`]: type,
            [`s-${size}`]: size,
            disabled,
        },
        className,
    );

    return (
        <div
            className={classes}
            style={{ width: width ? px2rem(width) : '100%', ...style }}
            onClick={!disabled ? onClick : undefined}
        >
            {children}
        </div>
    );
};

export default Button;

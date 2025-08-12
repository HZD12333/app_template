import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

import { ComponentBaseProps } from '@miyuan/types';

import './index.less';

interface RadioProps extends ComponentBaseProps {
    /** 是否选中 默认：false */
    checked?: boolean;
    onChange?(value: boolean): void;
    onClick?(e?: Event): void;
    clickable?: boolean;
}

export const Radio: React.FC<RadioProps> = (props) => {
    const { checked, onChange, className, children, clickable = true, onClick } = props;
    const [value, setValue] = useState(checked);

    const classes = classNames('my-radio', className, {
        checked: value,
    });

    const clickHandler = (event: { stopPropagation(): void }) => {
        event.stopPropagation();
        if (clickable) {
            setValue(!value);
            onChange && onChange(!value);
        } else {
            onClick && onClick();
        }
    };

    useEffect(() => {
        setValue(checked);
    }, [checked]);

    if (!children) return <div className={classes} onClick={clickHandler} />;

    return (
        <div className='flex align_c' onClick={clickHandler}>
            <div className={classes} />
            <div className='my-radio-label'>{children}</div>
        </div>
    );
};

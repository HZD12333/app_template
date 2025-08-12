import classNames from 'classnames';
import React, { useEffect } from 'react';

import { useGetExternal, useGetStatusBarHeight } from '@miyuan/hooks';
import { goBackPage, offNavigationBar, offTopTimeBar } from '@miyuan/native-apis';
import { ComponentBaseProps } from '@miyuan/types';

import styles from './index.module.less';

export interface NavBarProps extends ComponentBaseProps {
    leftExtra?: React.ReactNode;
    leftClassName?: string;
    rightExtra?: React.ReactNode;
    rightClassName?: string;
    theme?: 'light' | 'dark';
    onBack?: (goBack: () => void) => void;
    onRefresh?: () => void;
    onBackChange?: (type: 'back' | 'reload') => void;
    fillStatusBar?: boolean;
    backgroundColor?: string;
    useReactHistory?: boolean;
    position?: 'fixed' | 'sticky';
    flex?: boolean;
}

const NavBar: React.FC<NavBarProps> = (props) => {
    const {
        style,
        children,
        leftExtra,
        rightExtra,
        theme = 'dark',
        className,
        onBack,
        onRefresh,
        leftClassName,
        rightClassName,
        fillStatusBar = true,
        backgroundColor,
        useReactHistory,
        position = 'sticky',
        flex,
    } = props;
    const isExternal = useGetExternal();

    const statusBarHeight = useGetStatusBarHeight();

    const goBack = () => {
        if (isExternal || useReactHistory) {
            window.history.go(-1);
        } else {
            goBackPage();
        }
    };

    const backHandler = async () => {
        if (onBack) {
            onBack(goBack);
            return;
        }

        goBack();
    };

    const refresh = () => {
        if (onRefresh) {
            onRefresh();
            return;
        }

        window.location.reload();
    };

    useEffect(() => {
        // 关闭导航栏
        offNavigationBar(1);
        // 关闭状态栏
        offTopTimeBar(0);
    }, []);

    return (
        <>
            {fillStatusBar ? (
                <div
                    className={styles.statusBar}
                    style={{ height: statusBarHeight, backgroundColor, position }}
                />
            ) : null}
            <div
                className={classNames(styles.wrapper, styles[theme], className)}
                style={{ top: statusBarHeight, position, background: backgroundColor, ...style }}
            >
                <div className={leftClassName}>
                    {leftExtra || <div className={classNames(styles.back, 'item')} onClick={backHandler} />}
                </div>
                {children ? (
                    <div className={classNames(styles.title, { [styles.flex]: flex })}>{children}</div>
                ) : null}
                <div className={rightClassName}>
                    {rightExtra || <div className={classNames(styles.refresh, 'item')} onClick={refresh} />}
                </div>
            </div>
        </>
    );
};

export default React.memo(NavBar);

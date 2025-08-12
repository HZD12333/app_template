import classNames from 'classnames';
import { useEffect, useState } from 'react';

import { useLoadMore } from '@miyuan/hooks';

import { NavBar, ScrollList, INoDataProps, eNoDataType } from '@shares/components';

import { getCouponList } from '@/apis/coupon';
import { couponItem } from '@/apis/coupon/model';

import CouponListItem from './components/couponItem';
import config from './index.config';
import styles from './index.module.less';

const couponStateList = [
    {
        id: 0,
        label: '待使用',
    },
    {
        id: 1,
        label: '已使用/过期',
    },
];
const noDataProps: INoDataProps = {
    text: <div className={styles.noDataTip}>暂无可用优惠券</div>,
    style: {
        color: '#3D3D47',
        marginTop: '140px',
    },
    type: eNoDataType.Normal,
    size: 'small',
};
function formatter(res: { data: couponItem[]; hasNext: boolean }[]) {
    const [data] = res;
    return {
        dataList: data?.data,
        hasNext: false,
    };
}
const CouponList = () => {
    const [activeState, setActiveState] = useState(couponStateList[0].id);

    const {
        items: couponList,
        loading,
        hasNext,
        loadMore,
        reset,
    } = useLoadMore<couponItem>(getCouponList, {
        formatter,
        defaultParams: {
            status: activeState,
        },
        pageSize: 10,
    });
    console.log('couponList', couponList);
    const onClickSelection = (item: (typeof couponStateList)[0]) => {
        setActiveState(item.id);
        reset();
        loadMore({
            status: item.id,
        });
    };

    const onEndReached = () => {
        loadMore();
    };
    useEffect(() => {
        loadMore();
    }, []);
    return (
        <div className={styles.couponList}>
            <div className={styles.header}>
                <NavBar backgroundColor='#F5F7F9' rightExtra={<></>}>
                    {config.title}
                </NavBar>
                <div className={styles.tabs}>
                    {couponStateList.map((i) => {
                        return (
                            <div
                                key={i.id}
                                className={classNames(styles.tabItem, {
                                    [styles.active]: i.id === activeState,
                                })}
                                onClick={() => {
                                    onClickSelection(i);
                                }}
                            >
                                {i.label}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className={styles.list}>
                <ScrollList
                    items={couponList}
                    onEndReached={onEndReached}
                    hasNext={hasNext}
                    className={styles.scroll}
                    itemRender={(item, index) => <CouponListItem listItem={item} key={index} />}
                    loading={loading}
                    textColor='#A9ADB6'
                    noDataProps={noDataProps}
                />
            </div>
        </div>
    );
};

export default CouponList;

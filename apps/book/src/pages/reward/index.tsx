import classNames from 'classnames';
import { useEffect, useState } from 'react';

import { useLoadMore } from '@miyuan/hooks';

import { NavBar, ScrollList, INoDataProps, eNoDataType } from '@shares/components';

import { getOrderAwardSummary, getOrderAwardList } from '@/apis/reward';
import { rewardDetailsItem, orderAwardSummary } from '@/apis/reward/model';

import RewardItem from './components/rewardItem';
import config from './index.config';
import styles from './index.module.less';

const selectionList = [
    {
        id: 1,
        label: '本月',
    },
    {
        id: 2,
        label: '上个月',
    },
];
const tabList = [
    {
        id: 0,
        label: '全部',
    },
    {
        id: 1,
        label: '已付款',
    },
    {
        id: 3,
        label: '已结算',
    },
    {
        id: 4,
        label: '已失效',
    },
];
const noDataProps: INoDataProps = {
    text: <div className={styles.noDataTip}>暂无明细</div>,
    style: {
        color: '#3D3D47',
        marginTop: '140px',
        fontFamily: 'PingFangSC-Medium, PingFang SC',
    },
    type: eNoDataType.Normal,
    size: 'small',
};
function formatter(res: { list: rewardDetailsItem[]; hasNext: boolean }[]) {
    const [data] = res;
    return {
        dataList: data?.list,
        hasNext: data?.hasNext,
    };
}
const RewardDetails = () => {
    const [activeSelection, setActiveSelection] = useState(selectionList[0].id);
    const [activeTab, setActiveTab] = useState(tabList[0].id);
    const [summaryData, setSummaryData] = useState<orderAwardSummary>();
    const getOrderAwardSummaryData = async (id: number) => {
        const res = await getOrderAwardSummary({ selectMonth: id });
        console.log(res);
        setSummaryData(res);
    };

    const {
        items: awardList,
        loading,
        hasNext,
        loadMore,
        reset,
    } = useLoadMore<rewardDetailsItem>(getOrderAwardList, {
        formatter,
        defaultParams: {
            selectMonth: activeSelection,
            orderStatus: activeTab,
        },
        pageSize: 10,
    });
    const onClickSelection = (item: (typeof selectionList)[0]) => {
        setActiveSelection(item.id);
        getOrderAwardSummaryData(item.id);
        reset();
        loadMore({
            selectMonth: item.id,
        });
    };
    const onClickTab = (tab: (typeof tabList)[0]) => {
        setActiveTab(tab.id);
        reset();
        loadMore({
            orderStatus: tab.id,
        });
    };

    const onEndReached = () => {
        loadMore();
    };
    useEffect(() => {
        loadMore();
        getOrderAwardSummaryData(selectionList[0].id);
    }, []);
    return (
        <div className={styles.rewardDetails}>
            <div className={styles.header}>
                <NavBar backgroundColor='#FFD800' rightExtra={<></>} useReactHistory>
                    {config.title}
                </NavBar>
                <div className={styles.selection}>
                    {selectionList.map((i) => {
                        return (
                            <div
                                key={i.id}
                                className={classNames(styles.selectionItem, {
                                    [styles.active]: i.id === activeSelection,
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
                <div className={styles.overview}>
                    <div className={styles.oTop}>
                        <div className={styles.item}>
                            <p className={styles.value}>{summaryData?.orderCount ?? '-'}</p>
                            <p className={styles.label}>有效订单</p>
                        </div>
                        <div className={styles.item}>
                            <p className={styles.value}>¥{summaryData?.awardInfo ?? '-'}</p>
                            <p className={styles.label}>奖励金额</p>
                        </div>
                    </div>
                    <div className={styles.oBottom}>
                        * 活动期间直属下级每产生一笔图书订单, 额外奖励2元, 多单多奖励
                    </div>
                </div>
                <div className={styles.tabs}>
                    {tabList.map((i) => {
                        return (
                            <div
                                key={i.id}
                                className={classNames(styles.tabItem, {
                                    [styles.active]: i.id === activeTab,
                                })}
                                onClick={() => {
                                    onClickTab(i);
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
                    items={awardList}
                    onEndReached={onEndReached}
                    hasNext={hasNext}
                    className={styles.scroll}
                    itemRender={(item) => <RewardItem listItem={item} key={item.orderId} />}
                    loading={loading}
                    textColor='#A9ADB6'
                    noDataProps={noDataProps}
                />
            </div>
        </div>
    );
};

export default RewardDetails;

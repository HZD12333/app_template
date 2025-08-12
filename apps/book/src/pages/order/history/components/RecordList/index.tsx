// import PullToRefresh from '@shares/components/base/pullToRefresh';
import { useEffect, useState } from 'react';
// import { jumpRoutePage } from 'src/common/helper';

import { useMemoizedFn, useLoadMore } from '@miyuan/hooks';

import { NoData, ScrollList } from '@shares/components';
import { useNavigate } from '@shares/hooks';

import { getOrderList } from '@/apis/historyRecordAndDetail';
import { HistoryRecordItem } from '@/apis/historyRecordAndDetail/model';

import RecordItem from './components/list';
import styles from './index.module.less';
type Props = {
    orderStatus?: number;
};
const DEFAULT_VALUE = {
    orderStatus: -1,
};

const Home = ({ orderStatus }: Props) => {
    const [now, setNow] = useState<number>();
    const navigateTo = useNavigate();

    const handleListActivity = useMemoizedFn(async (params: { orderStatus: number }) => {
        const res = await getOrderList(params);
        const dataList = res.length > 0 ? res[0]?.data?.list || [] : [];
        const timestamp = res.length > 0 ? res[0]?.timestamp : Date.now();
        const hasNext = res.length > 0 ? res[0]?.data?.hasNext : false;
        setNow(timestamp);

        return {
            dataList,
            hasNext,
        };
    });

    const { items, loading, hasNext, loadMore, reset } = useLoadMore<HistoryRecordItem>(handleListActivity, {
        defaultParams: DEFAULT_VALUE,
        pageSize: 10,
    });

    const handleDetails = useMemoizedFn((path: string, query: { orderId?: string; afterSaleId?: string }) => {
        navigateTo(path, { useHistory: true, appendQuery: true, query });
    });

    useEffect(() => {
        reset();
        loadMore({ orderStatus });
    }, [orderStatus]);

    return (
        <div className={styles.wrapper}>
            {!loading && items.length === 0 ? (
                <div className={styles['wrapper-list-nodata']}>
                    <NoData text='暂无数据' style={{ color: '#666666' }} />
                </div>
            ) : (
                <ScrollList
                    items={items}
                    itemRender={(item, index) => (
                        <RecordItem now={now} dataItem={item} key={index} handleDetails={handleDetails} />
                    )}
                    onEndReached={loadMore}
                    loading={loading}
                    hasNext={hasNext}
                />
            )}
        </div>
    );
};
export default Home;

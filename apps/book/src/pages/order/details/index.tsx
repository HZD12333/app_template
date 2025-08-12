/* eslint-disable import/no-self-import */
import { useState, useEffect, useCallback } from 'react';

import { parseQuery } from '@miyuan/utils';

import NavBar from '@shares/components/base/nav-bar';

import { getOrderDetail } from '@/apis/historyRecordAndDetail';
import { OrderDetail } from '@/apis/historyRecordAndDetail/model';

import PopUpForDetails from './components/PopUpForDetails';
import styles from './index.module.less';

type activityDetailItem = OrderDetail;

const Home = () => {
    const { orderId } = parseQuery();
    const [selfBooksInfo, setSelfBooksInfo] = useState<activityDetailItem>({} as activityDetailItem);

    const handleRequestActivity = useCallback(async () => {
        const res = await getOrderDetail({ orderId });
        setSelfBooksInfo(res as activityDetailItem);
    }, []);

    useEffect(() => {
        handleRequestActivity();
    }, []);
    return (
        <div className={styles.home}>
            <NavBar backgroundColor='transparent' rightExtra={<></>} useReactHistory />
            {selfBooksInfo.orderId && <PopUpForDetails selfBooksInfo={selfBooksInfo} />}
        </div>
    );
};
export default Home;

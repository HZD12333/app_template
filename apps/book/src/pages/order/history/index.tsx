import { useState, useCallback } from 'react';

import { NavBar } from '@shares/components';

import RecordList from './components/RecordList';
import Tabs from './components/Tabs';
import styles from './index.module.less';

const Home = () => {
    const [activityStatus, setActivityStatus] = useState<number>(-1);
    const handleActivityCategory = useCallback((aSt) => {
        setActivityStatus(aSt);
    }, []);

    return (
        <div className={styles.home}>
            <div
                className={styles['nav-bar']}
                style={{
                    position: 'sticky',
                }}
            >
                <NavBar backgroundColor='#fff' rightExtra={<></>}>
                    全部订单
                </NavBar>
                <Tabs defaultActive={activityStatus} onChange={handleActivityCategory} />
            </div>
            <RecordList orderStatus={activityStatus} />
        </div>
    );
};
export default Home;

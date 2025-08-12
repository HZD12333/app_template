import { NoData } from '@shares/components';

import styles from './index.module.less';

const NotFound = () => {
    return (
        <div className={styles.wrapper}>
            <NoData
                text='页面出错了，请稍后再试～'
                iconUrl='https://img.gzzhitu.com/zhitu-api/1713947178922903.png'
            />
        </div>
    );
};

export default NotFound;

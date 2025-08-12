import { parseQuery } from '@miyuan/utils';

import { NavBar } from '@shares/components';

import styles from './index.module.less';

export default function ImagePage() {
    const { url = '', title = '', backgroundColor } = parseQuery();

    return (
        <div className={styles.wrapper} style={{ backgroundColor }}>
            <NavBar backgroundColor='#fff' rightExtra={<></>} useReactHistory>
                {title}
            </NavBar>
            <img className={styles.image} src={url} alt='' />
        </div>
    );
}

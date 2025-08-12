import { goSuperEntrance } from '@miyuan/native-apis';
import { parseQuery } from '@miyuan/utils';

import { Image } from '@shares/components';
import { useNavigate } from '@shares/hooks';

import styles from './index.module.less';

interface BannerItem {
    id: number;
    banner: string;
    type: 'reward' | 'material';
}

const bannerList: BannerItem[] = [
    {
        id: 1,
        banner: 'https://img.gzzhitu.com/zhitu-api/1747986312824.png',
        type: 'reward',
    },
    {
        id: 2,
        banner: 'https://img.gzzhitu.com/zhitu-api/1747986334090.png',
        type: 'material',
    },
];

const SecondBanner = () => {
    const navigate = useNavigate();

    const onClickItem = (item: BannerItem) => {
        const { materialId } = parseQuery();
        if (item.type === 'material') {
            goSuperEntrance({
                open: 2,
                classId: 72,
                ext: materialId,
            });
        } else {
            navigate('/reward', { useHistory: true, appendQuery: true });
        }
    };

    return (
        <div className={styles.wrapper}>
            {bannerList.map((item) => (
                <Image
                    key={item.id}
                    src={item.banner}
                    width={349}
                    height={162}
                    onClick={() => onClickItem(item)}
                    loading='eager'
                />
            ))}
        </div>
    );
};

export default SecondBanner;

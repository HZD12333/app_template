import { useCallback, useEffect, useMemo, useState } from 'react';

import { useLoadMore, useGetStatusBarHeight } from '@miyuan/hooks';
import { BaseAny } from '@miyuan/types';

import { NavBar, Image, ScrollList, SearchBar, INoDataProps, eNoDataType } from '@shares/components';
import { useUserInfo, useNavigate } from '@shares/hooks';

import { getHomeGoods } from '@/apis/goods';
import { GoodsItem } from '@/apis/goods/model';

import ProductCard from './components/product-card';
import SecondBanner from './components/second-banner';
import config from './index.config';
import styles from './index.module.less';

const PAGE_ID = 'book-home';
const defaultParams = {
    condition: {
        activityId: 1,
    },
};
const noDataProps: INoDataProps = {
    text: (
        <>
            <p>暂无搜索结果</p>
            <p className={styles.noDataTip}>换个关键词再搜吧～</p>
        </>
    ),
    style: {
        color: '#fff',
    },
    type: eNoDataType.Search,
    size: 'small',
};

const formatter = (res: { dataList: GoodsItem[]; hasNext: boolean }[]) => (res[0] ? res[0] : ({} as BaseAny));

function interceptor(params: Record<string, any>) {
    const { page, rows, condition, ...rest } = params;
    return {
        page,
        rows,
        condition: {
            ...condition,
            ...rest,
        },
    };
}

const Home = () => {
    const { hasLogin, checkLogin } = useUserInfo();

    /** 滚动相关 */
    const { items, loading, hasNext, loadMore, reset } = useLoadMore<GoodsItem>(getHomeGoods, {
        sizeKey: 'rows',
        defaultParams,
        formatter,
    });

    const itemRender = useCallback(
        (itemData, index) => {
            return <ProductCard key={index} hasLogin={hasLogin} itemData={itemData} />;
        },
        [hasLogin],
    );

    const handleSearch = useCallback(
        (keyword: string) => {
            reset();
            loadMore({ keyWord: keyword }, interceptor);
        },
        [reset],
    );

    const navigate = useNavigate();
    const viewRule = () => {
        navigate('/image-page', {
            useHistory: true,
            query: {
                title: '活动规则',
                url: 'https://img.gzzhitu.com/zhitu-api/1748505842366.png',
                backgroundColor: '#FF7F2C',
            },
        });
    };
    const rightExtra = useMemo(
        () => <div onClick={() => navigate('/order/history')}>我的订单</div>,
        [navigate],
    );

    const statusBarHeight = useGetStatusBarHeight();
    const [stickyTop, setStickyTop] = useState(0);

    useEffect(() => {
        const nav = document.querySelector(`#${PAGE_ID} .home-nav`) as HTMLDivElement;
        setStickyTop(statusBarHeight + (nav.clientHeight || 0) - 1);
    }, [statusBarHeight]);

    useEffect(() => {
        checkLogin(() => loadMore({}, interceptor));
    }, []);

    return (
        <div className={styles.wrapper} id={PAGE_ID}>
            <NavBar
                className='home-nav'
                backgroundColor='#fff'
                rightExtra={rightExtra}
                rightClassName={styles.right}
            >
                {config.title}
            </NavBar>
            <div className={styles.banner}>
                <Image src='https://img.gzzhitu.com/zhitu-api/1749001701826.png' loading='eager' />
                <div className={styles.rule} onClick={viewRule} />
            </div>
            <SecondBanner />
            <div className={styles.sticky} style={{ top: stickyTop }}>
                <SearchBar placeholder='搜索活动图书名称关键词' onSearch={handleSearch} />
            </div>
            <ScrollList
                items={items}
                itemRender={itemRender}
                onEndReached={loadMore}
                loading={loading}
                hasNext={hasNext}
                noDataProps={noDataProps}
                textColor='#fff'
            />
        </div>
    );
};

export default Home;

import classNames from 'classnames';
import React from 'react';

import { urlKeepHttps } from '@miyuan/helpers';
import { selfOperatedBooksGoodDetail, selfOperatedBooksGoodShare } from '@miyuan/native-apis';
import { ComponentBaseProps, FnType } from '@miyuan/types';
import { toast } from '@miyuan/ui-omi';
import { isAfterVersion } from '@miyuan/utils';

import { Money, Image } from '@shares/components';

import { GoodsItem } from '@/apis/goods/model';

import './index.less';

const replacedStr = (str: string) => {
    if (!str) return null;

    // 使用正则表达式找到数字部分
    const numMatch = str.match(/[\d.]+/);
    const numStr = numMatch ? numMatch[0] : ''; // 提取到的数字字符串

    // 找到数字在字符串中的起始和结束位置
    const numStartIndex = str.indexOf(numStr);
    const numEndIndex = numStartIndex + numStr.length;

    return (
        <>
            {str.slice(0, numStartIndex)}
            <span className='money'>{numStr}</span>
            {str.slice(numEndIndex)}
        </>
    );
};

interface ProductCardProps extends ComponentBaseProps {
    itemData: GoodsItem;
    hasLogin?: boolean;
}

const checkVersion = (callback: FnType) => {
    if (isAfterVersion(6850)) {
        callback();
    } else {
        toast('请升级APP版本');
    }
};

interface ProductCardProps extends ComponentBaseProps {
    itemData: GoodsItem;
    hasLogin?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = (props) => {
    const { itemData, hasLogin, className } = props;

    const goDetail = () => {
        checkVersion(() => selfOperatedBooksGoodDetail(itemData.goodsId));
    };

    const handleShare = (e) => {
        e.stopPropagation(); // 阻止事件冒泡，避免触发 goDetail
        checkVersion(() => selfOperatedBooksGoodShare(itemData.goodsId));
    };

    return (
        <div className={classNames(className, 'my-product-card')} onClick={goDetail}>
            <div className='left'>
                <Image
                    borderRadius={7}
                    width={220}
                    height={220}
                    src={urlKeepHttps(itemData.mainPics[0])}
                    objectFit='fill'
                />
            </div>
            <div className='right'>
                <div className='top'>
                    <div className='title'>
                        <span className='icon' />
                        <span>{itemData.title}</span>
                    </div>
                    <div className='my-product-tag'>
                        {itemData.labels?.map((tag, index) => (
                            <div className='tag' key={index}>
                                {tag}
                            </div>
                        ))}
                    </div>
                </div>
                <div className='bottom'>
                    <div className='price-area'>
                        <span className='group'>{itemData.priceTitle}</span>
                        <Money value={itemData.currentPrice} />
                        <span className='origin'>
                            ¥<span style={{ textDecoration: 'line-through' }}>{itemData.originPrice}</span>
                        </span>
                    </div>
                    <div className='operation'>
                        {itemData.couponPrice || !hasLogin ? (
                            <div className='btn'>{replacedStr(itemData.couponPriceTip || '')}</div>
                        ) : (
                            <>
                                <div className={classNames('btn', 'promotion')} onClick={handleShare}>
                                    推广
                                </div>
                                <div className='btn'>立即参团</div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

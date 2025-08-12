/**
 * GoodsItem
 */
export interface GoodsItem {
    /**
     * 购买限制
     */
    buyLimit: number;
    /**
     * 购买提示
     */
    buyTip: string;
    /**
     * 渠道
     */
    channel: string;
    /**
     * 券后价，不为空展示该文本信息
     */
    couponPrice?: string;
    /**
     * 新人券后价，couponPrice 不为空展示该文本信息
     */
    couponPriceTip?: string;
    /**
     * 现价，单位元
     */
    currentPrice: string;
    /**
     * 详情图片
     */
    detailPics: string[];
    /**
     * 运费，单位元
     */
    freightPrice: string;
    /**
     * 商品id
     */
    goodsId: string;
    /**
     * 商品标签
     */
    labels?: string[];
    /**
     * 主图
     */
    mainPics: string[];
    /**
     * 原价，单位元
     */
    originPrice: string;
    /**
     * 价格标题（团购价）
     */
    priceTitle?: string;
    /**
     * 分享提示
     */
    shareTip: string;
    /**
     * 分享url
     */
    shareUrl: string;
    /**
     * 商品标题
     */
    title: string;
    [property: string]: any;
}

/**
 * 设计稿像素转rem
 * @param px 设计稿像素
 * @param len 保留长度
 */
export const px2rem = (px: number, len = 3) => `${(px / 75).toFixed(len)}rem`;

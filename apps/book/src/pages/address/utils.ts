import { AddressItemModel } from '@/apis/address/model';

/** 拼接省市区回显 */
export const joinRegionLabel = (addressInfo: AddressItemModel, sign = '') => {
    const { province, city, district } = addressInfo;
    if (province && city && district) {
        return `${province}${sign}${city}${sign}${district}`;
    }
    if (province && city) {
        return `${province}${sign}${city}`;
    }
    if (province) {
        return province;
    }
    return '';
};

export enum eOperationType {
    SELECTED = 'selected', // 选择地址
    EDIT = 'edit', // 编辑地址
    ADD = 'add', // 新增地址
}

import classNames from 'classnames';
import { useState, useRef, useEffect, useCallback } from 'react';

import { selfOperatedBooksHarvestAddress, goBackPage } from '@miyuan/native-apis';
import { LabelValueOption } from '@miyuan/types';
import { toast } from '@miyuan/ui-omi';
import { Nullable, parseQuery } from '@miyuan/utils';

import { NavBar, Button, Radio, RegionPicker, type RegionPickerRef } from '@shares/components';
import { getZodErrorMessage } from '@shares/utils/zod';

import { updateAddress, getAddressDetail } from '@/apis/address';
import { AddressItemModel, addressSchema } from '@/apis/address/model';

import { joinRegionLabel, eOperationType } from '../utils';

import styles from './index.module.less';

const fixBarStyle = {
    backgroundColor: 'transparent',
    border: 0,
    paddingBottom: '24px',
};

/** 获取省市区字段值 */
const getRegionValue = (value: Nullable<LabelValueOption>[]) => {
    const obj = {};
    const province = value[0] || ({} as LabelValueOption);
    obj['province'] = province.label;
    obj['provinceCode'] = province.value;

    const city = value[1] || ({} as LabelValueOption);
    obj['city'] = city.label || '';
    obj['cityCode'] = city.value || '';

    const district = value[2] || ({} as LabelValueOption);
    obj['district'] = district.label || '';
    obj['districtCode'] = district.value || '';

    return obj;
};

const AddressEdit = () => {
    // 操作类型 operationType: 选择地址
    const { id, operationType } = parseQuery();
    const [addressInfo, setAddressInfo] = useState<AddressItemModel>({
        isDefault: 1,
    } as AddressItemModel);

    const pickerRef = useRef<RegionPickerRef>(null);

    const selectHandler = () => {
        const { provinceCode, cityCode, districtCode } = addressInfo;
        pickerRef.current?.open(provinceCode ? [provinceCode, cityCode, districtCode] : undefined);
    };

    // 保存
    const onSaveAddress = async () => {
        const result = addressSchema.safeParse(addressInfo);

        if (!result.success) {
            toast(getZodErrorMessage(result.error));
        } else {
            const [res] = await updateAddress(result.data);
            if (!res) return;

            if (operationType === eOperationType.SELECTED) {
                selfOperatedBooksHarvestAddress(res.addressId!);
                goBackPage();
            } else {
                history.go(-1);
            }
        }
    };

    // 获取地址详情信息
    const getDetail = async (addressId: string) => {
        const res = await getAddressDetail({ addressId });

        if (res) {
            const result = addressSchema.safeParse(res);
            if (result.success) {
                setAddressInfo(result.data);
            } else {
                toast('地址字段存在异常');
            }
        }
    };

    const handleChange = useCallback((value) => {
        setAddressInfo((val) => ({
            ...val,
            ...getRegionValue(value),
        }));
    }, []);

    useEffect(() => {
        if (id) {
            getDetail(id);
        }
    }, []);

    return (
        <div className={styles.wrapper}>
            <NavBar backgroundColor='#F5F7F9' rightExtra={<></>} useReactHistory>
                {`${id ? '编辑' : '新增'}收货地址`}
            </NavBar>
            <div className={styles.main}>
                <div className={classNames(styles['address-section'], 'flex', 'align_c')}>
                    <div className={styles.label}>收货人</div>
                    <input
                        className={styles.input}
                        type='text'
                        value={addressInfo.contactName}
                        maxLength={15}
                        placeholder='请输入收货人姓名'
                        onChange={(e) =>
                            setAddressInfo((val) => ({
                                ...val,
                                contactName: e.target.value.trim(),
                            }))
                        }
                    />
                </div>
                <div className={classNames(styles['address-section'], 'flex', 'align_c')}>
                    <div className={styles.label}>联系电话</div>
                    <input
                        className={styles.input}
                        type='text'
                        value={addressInfo.phone}
                        maxLength={11}
                        placeholder='请输入手机号码'
                        onChange={(e) =>
                            setAddressInfo((val) => ({
                                ...val,
                                phone: e.target.value.replace(/\D/g, ''),
                            }))
                        }
                    />
                </div>
                <div className={classNames(styles['address-section'], 'flex')}>
                    <div className={styles.label}>所在地区</div>
                    <div className={styles.picker} onClick={selectHandler}>
                        {addressInfo.provinceCode ? (
                            <div className={styles.selected}>
                                <div className={styles.region}>{joinRegionLabel(addressInfo, ' ')}</div>
                                <div className={styles.arrow}></div>
                            </div>
                        ) : (
                            <div className={styles.placeholder}>
                                <span>请选择省/市/区</span>
                                <div className='flex align_c'>
                                    <span className={styles.text}>请选择</span>
                                    <div className={styles.arrow}></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className={classNames(styles['address-section'], 'flex')}>
                    <div className={styles.label}>详细地址</div>
                    <input
                        className={styles.input}
                        value={addressInfo.address}
                        maxLength={100}
                        placeholder='请输入详细地址'
                        onChange={(e) =>
                            setAddressInfo((val) => ({
                                ...val,
                                address: e.target.value.trim(),
                            }))
                        }
                    />
                </div>
                <div className={styles.default}>
                    <Radio
                        checked={addressInfo.isDefault === 1}
                        onChange={() =>
                            setAddressInfo((val) => ({
                                ...val,
                                isDefault: val.isDefault === 1 ? 0 : 1,
                            }))
                        }
                    >
                        默认地址
                    </Radio>
                </div>
            </div>

            <RegionPicker ref={pickerRef} onChange={handleChange} />
            <my-fixed-bar style={fixBarStyle}>
                <Button type='primary' width={586} onClick={onSaveAddress}>
                    保存
                </Button>
            </my-fixed-bar>
        </div>
    );
};

export default AddressEdit;

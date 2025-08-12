import { useEffect } from 'react';

import { useMemoizedFn, useLoadMore } from '@miyuan/hooks';
import { selfOperatedBooksHarvestAddress, goBackPage } from '@miyuan/native-apis';
import { toast, openDialog } from '@miyuan/ui-omi';
import { parseQuery } from '@miyuan/utils';

import { NoData, Button, Radio, ScrollList, NavBar } from '@shares/components';
import { useNavigate, useUserInfo } from '@shares/hooks';

import { getAddressList, setDefaultAddress, deleteAddress } from '@/apis/address';
import { AddressItemModel } from '@/apis/address/model';

import { joinRegionLabel, eOperationType } from '../utils';

import config from './index.config';
import styles from './index.module.less';

const fixBarStyle = {
    backgroundColor: 'transparent',
    border: 0,
    paddingBottom: '24px',
};

function formatter(res: { list: AddressItemModel[]; hasNext: boolean }[]) {
    const [data] = res;
    return {
        dataList: data?.list,
        hasNext: data?.hasNext,
    };
}

// 是否已自动跳到过新建地址页面
let hadRedirected = false;

const AddressPage = () => {
    const { checkLogin } = useUserInfo();
    const navigateTo = useNavigate();
    const { operationType, local } = parseQuery();

    const onSuccess = (list: AddressItemModel[], params: { page: number }) => {
        // 没有地址列表自动跳转到新增地址页面
        if (params.page === 1 && list.length === 0 && !hadRedirected) {
            hadRedirected = true;
            navigateTo('/address/edit', {
                useHistory: true,
                appendQuery: true,
                query: { operationType: eOperationType.SELECTED },
            });
        }
    };

    /** 滚动相关 */
    const { items, loading, hasNext, loadMore, reset } = useLoadMore<AddressItemModel>(getAddressList, {
        formatter,
        sizeKey: 'rows',
        onSuccess,
    });

    // 跳转新增&编辑地址页面
    const editHandler = (event?: { stopPropagation(): void }, item?: AddressItemModel) => {
        event?.stopPropagation();

        const isAdd = !item;
        if (isAdd && items.length >= 15) {
            toast('最多只能创建15个收货地址');
            return;
        }

        navigateTo('/address/edit', {
            useHistory: true,
            appendQuery: true,
            checkLogin,
            query: {
                operationType: !items.length && isAdd ? eOperationType.SELECTED : '',
                id: item?.addressId || '',
            },
        });
    };

    // 打开确认删除弹窗
    const openDelete = (event: { stopPropagation(): void }, item: AddressItemModel) => {
        event.stopPropagation();
        const handelDelAddress = async () => {
            if (!item) return;

            const [_, error] = await deleteAddress({ addressId: item.addressId! });
            if (!error) {
                reset();
                loadMore();
            }
        };
        openDialog({
            title: '确认删除',
            content: '确认删除该地址吗？',
            okText: '删除',
            cancelText: '取消',
            textStyle: 'text-align: center;',
            hideCancelBtn: false,
            onOk: handelDelAddress,
        });
    };

    // 切换默认地址
    const setDefault = async (item: AddressItemModel) => {
        if (item.isDefault) return;

        await setDefaultAddress({ addressId: item.addressId! });

        reset();
        loadMore();
    };

    // 选择地址
    const handleSelect = (item: AddressItemModel) => {
        if (operationType !== eOperationType.SELECTED) return;

        if (local) {
            history.go(-1);
        } else {
            selfOperatedBooksHarvestAddress(item.addressId!);
            goBackPage();
        }
    };

    const itemRender = useMemoizedFn((item: AddressItemModel, index?: number) => (
        <div className={styles.addressItem} key={index} onClick={() => handleSelect(item)}>
            <div className={styles.user}>
                <div className={styles.name}>{item.contactName}</div>
                <div>{item.phone}</div>
            </div>
            <div className={styles.address}>
                {joinRegionLabel(item)}
                {item.address}
            </div>
            <div className={styles.divide} />
            <div className={styles.bottom}>
                <Radio onClick={() => setDefault(item)} checked={item.isDefault === 1} clickable={false}>
                    默认地址
                </Radio>
                <div className='flex align_c'>
                    <div className={styles.btn} onClick={(e) => openDelete(e, item)}>
                        删除
                    </div>
                    <div className={styles.line} />
                    <div className={styles.btn} onClick={(e) => editHandler(e, item)}>
                        编辑
                    </div>
                </div>
            </div>
        </div>
    ));

    useEffect(() => {
        checkLogin(loadMore);
    }, []);

    return (
        <div className={styles.wrapper}>
            <NavBar backgroundColor='#F5F7F9' rightExtra={<></>}>
                {config.title}
            </NavBar>
            {items.length === 0 && !loading ? (
                <div className={styles.noAddress}>
                    <NoData text='暂无收货地址' style={{ color: '#3D3D47' }} />
                    <Button type='primary' width={280} onClick={editHandler}>
                        <span className={styles.addIcon} />
                        新增地址
                    </Button>
                </div>
            ) : (
                <>
                    <ScrollList
                        items={items}
                        itemRender={itemRender}
                        onEndReached={loadMore}
                        loading={loading}
                        hasNext={hasNext}
                    />
                    <my-fixed-bar style={fixBarStyle}>
                        <Button type='primary' width={586} onClick={editHandler}>
                            <span className={styles.addIcon} />
                            新增地址
                        </Button>
                    </my-fixed-bar>
                </>
            )}
        </div>
    );
};

export default AddressPage;

## 接口定义

``` javascript
import { ApiProxy } from '@/services/http';

interface IParams {
    activityId: string;
    page: number;
    rows: number;
}

// 常规接口
export const demo = (params: IParams) =>
    ApiProxy<ProductItem[]>(
        {
            url: '/gw/api/taskCenter/proxy/activity/getActivityNewGoodsInfoList',
            type: 'get',
        },
        params,
    );

// 自动显示loading
export const demo = (params: IParams) =>
    ApiProxy<ProductItem[]>(
        {
            url: '/gw/api/taskCenter/proxy/activity/getActivityNewGoodsInfoList',
            type: 'get',
            loading: true,
        },
        params,
    );

// 隐藏toast
export const demo = (params: IParams) =>
    ApiProxy<ProductItem[]>(
        {
            url: '/gw/api/taskCenter/proxy/activity/getActivityNewGoodsInfoList',
            type: 'get',
            hideToast: true,
        },
        params,
    );

// 返回后端完整数据，当code不是成功时，后端完整会在 err 中返回
export const demo = (params: IParams) =>
    ApiProxy<ProductItem[]>(
        {
            url: '/gw/api/taskCenter/proxy/activity/getActivityNewGoodsInfoList',
            type: 'get',
            deep: true,
        },
        params,
    );
```

## 使用方式

``` javascript
const fn = async () => {
    // 当code不是成功时，后端完整会在 err 中返回
    const [res, err] = await demo();
    if (!err) {
        // 请求无异常
        console.log(res);
    } else {
        // 请求有异常
        console.log(res);
    }
};
```
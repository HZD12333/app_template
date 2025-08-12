- 在各个项目根目录新建 .mockrc.js
- 复制粘贴以下内容
- 配置文件异步加载，修改后可能需要手动刷新页面才生效

```js
export default {
    /**
     * * Mock服务地址
     *  本地: http://127.0.0.1:4523/m1 可改为其他人的内网ip地址访问其Mock服务
     *  云端: https://apifox.gzmiyuan.com/m1
     */
    host: 'http://127.0.0.1:4523/m1',
    /**
     * * 需转发到Mock服务的接口
     * 接口配置规则 { [`${项目 ID}-${版本编号}-${服务编号}`]: 接口路径[] } 点击生成代码-生成接口请求代码  即可复制
     * 例: { '345092-308243-default': ['/api/taskCenter/proxy/goods'] }
     */
    includes: {
        '345092-308243-default': [],
    },
};
```


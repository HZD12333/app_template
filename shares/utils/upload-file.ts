import axios from 'axios';

import { onScriptLoad } from '@miyuan/utils';

export type OssConfigType = {
    StatusCode: string;
    AccessKeyId: string;
    AccessKeySecret: string;
    SecurityToken: string;
    Expiration: string;
    host: string;
    callback: string;
    privateBucket: string;
    bucket: string;
};

export type FileType = {
    name: string;
    size: number;
    type: string;
};

type InfoType = {
    accessKeyId: string;
    accessKeySecret: string;
    stsToken: string;
};

const REGION = 'oss-cn-shenzhen';
const OSS_SDK = 'https://img.gzzhitu.com/zhitu-api/aliyun-oss-sdk-6.23.0.min.js';
const getFileName = () => `${Date.now()}${Math.floor(Math.random() * 1000)}`;

// 文件上传
export const uploadFileToOss = async (config: OssConfigType, file: FileType) => {
    if (!file) return null;

    try {
        const { host, bucket, AccessKeyId, AccessKeySecret, SecurityToken } = config;
        const hostValue = host.includes(REGION)
            ? `${host.split('//')[0]}//miyuan-static.${host.split('//')[1]}`
            : host;

        const refreshSTSToken = async () => {
            const info = await axios<unknown, InfoType>(hostValue);
            return {
                accessKeyId: info.accessKeyId,
                accessKeySecret: info.accessKeySecret,
                stsToken: info.stsToken,
            };
        };

        await onScriptLoad(OSS_SDK);

        const oss = new OSS({
            region: REGION,
            accessKeyId: AccessKeyId,
            accessKeySecret: AccessKeySecret,
            bucket,
            stsToken: SecurityToken,
            refreshSTSToken,
            refreshSTSTokenInterval: 300000,
        });

        const fileType = file.name.split('.').pop();
        const objectName = `/${bucket}/${getFileName()}.${fileType}`;
        const res = await oss.multipartUpload(objectName, file);
        return hostValue + res.name;
    } catch (error) {
        console.log(error);
        return null;
    }
};

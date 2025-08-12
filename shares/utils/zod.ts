import z from 'zod/v4';

import { Recordable } from '@miyuan/types';

/**
 * 获取Zod 错误对象的第一个错误message
 * @param error Zod错误对象
 * @returns 错误消息字符串
 */
export const getZodErrorMessage = (error: z.ZodError<Recordable>) => {
    const tree = z.treeifyError(error);

    if (!tree.properties || Object.keys(tree.properties).length === 0) {
        return '未知错误';
    }

    const values = Object.values(tree.properties);

    if (values.length > 1) {
        return '请先完善表单信息';
    }

    return values[0]!.errors[0];
};

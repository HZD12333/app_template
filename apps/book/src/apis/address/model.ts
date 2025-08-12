import z from 'zod/v4';

export const addressSchema = z.object({
    address: z.string('请输入详细地址').refine((val) => val, {
        message: '请输入详细地址',
    }),
    contactName: z.string().refine((val) => val, {
        message: '请输入收货人姓名',
    }),
    addressId: z.string().optional(),
    isDefault: z.number().default(0),
    phone: z
        .string()
        .refine((val) => val && val.replace(/\s/g, '').length === 11 && /^1[3456789]\d{9}$/.test(val), {
            message: '请输入正确的手机号',
        }),
    province: z.string().refine((val) => val, {
        message: '请选择省/市/区信息',
    }),
    provinceCode: z.string().refine((val) => val, {
        message: '请选择省/市/区信息',
    }),
    city: z.string().nullable(),
    cityCode: z.string().nullable(),
    district: z.string().nullable(),
    districtCode: z.string().nullable(),
});

export type AddressItemModel = z.infer<typeof addressSchema>;

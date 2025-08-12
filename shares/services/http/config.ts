export const HTTP_STATUS = {
    SUCCESS: 200,
    CREATED: 201,
    ACCEPTED: 202,
    CLIENT_ERROR: 400,
    AUTHENTICATE: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
};

export const BUSINESS_CODE = {
    COMPLETE: '0',
    COMPLETE2: 'B00000',
    COMPLETE3: 200,
    // 以下四种状态都要跳转到登录页
    UN_LOGIN: 'B10019', // 未登录
    UN_LOGIN_GW: '05011', // 新架构未登录
    SIGN_OUT: 'P00503', // 注销
    FENG_HAO: 'P00501', // 封号
    KICK_OFF: 'P00502', // 踢下线
};

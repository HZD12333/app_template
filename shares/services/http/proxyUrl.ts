import { MockServer } from '@miyuan/service';

export const proxyUrl = (url: string) => {
    if (process.env.NODE_ENV === 'development') {
        url = MockServer.proxyUrl(url);
    }

    return url;
};

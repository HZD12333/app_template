import classNames from 'classnames';
import React, { ImgHTMLAttributes, useEffect, useRef, useState } from 'react';

import { urlKeepHttps } from '@miyuan/helpers';

import { px2rem } from '@shares/utils';

import './index.less';

type ImageProps = ImgHTMLAttributes<any> & {
    width?: number;
    height?: number;
    hideSkeleton?: boolean;
    borderRadius?: number;
    objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
};

export const Image: React.FC<ImageProps> = (props) => {
    const {
        width,
        height,
        borderRadius,
        className,
        hideSkeleton,
        objectFit = 'contain',
        loading = 'lazy',
        src = '',
        alt = '',
        ...rest
    } = props;

    const [loaded, setLoaded] = useState(true);
    const imgRef = useRef<HTMLImageElement>(null);

    const style = {
        width: width ? px2rem(width) : undefined,
        height: height ? px2rem(height) : undefined,
        borderRadius: borderRadius ? px2rem(borderRadius) : undefined,
        objectFit,
    };

    const webpLink = `${src}?x-oss-process=image/format,webp`;

    useEffect(() => {
        const ele = imgRef.current;
        if (!ele || hideSkeleton) return;

        setLoaded(false);
        const handler = () => setLoaded(true);

        ele.addEventListener('load', handler);

        return () => ele.removeEventListener('load', handler);
    }, []);

    return (
        <picture>
            <source srcSet={webpLink} type='image/webp' />
            <img
                ref={imgRef}
                className={classNames('my-image', className)}
                src={urlKeepHttps(src)}
                data-loaded={loaded ? 'loaded' : undefined}
                {...rest}
                style={style}
                loading={loading}
                alt={alt}
            />
        </picture>
    );
};

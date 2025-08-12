import React from 'react';
import { useInView } from 'react-intersection-observer';

import type { ComponentBaseProps } from '@miyuan/types';

interface LazyLoadProps extends ComponentBaseProps {
    threshold?: number;
    rootMargin?: string;
}

export const LazyLoad: React.FC<LazyLoadProps> = (props) => {
    const { threshold, rootMargin, children, className } = props;

    const { ref, inView } = useInView({
        threshold,
        rootMargin,
        triggerOnce: true,
    });

    return (
        <div ref={ref} className={className}>
            {inView ? children : null}
        </div>
    );
};

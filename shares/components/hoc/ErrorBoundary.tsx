import React from 'react';

import { renderCapture } from '@shares/services/sentry';

import Button from '../base/button';

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({ error, errorInfo });
        renderCapture(error);
    }

    render() {
        if (!this.state.hasError) return this.props.children;

        return (
            <div style={{ padding: `120px 20px 20px` }}>
                <h2 style={{ textAlign: 'center' }}>当前页面加载出错了</h2>
                <p
                    style={{
                        margin: '18px 0',
                        color: '#ff3141',
                        padding: '2.5vh 4vw',
                        background: '#000',
                        borderRadius: 8,
                    }}
                >
                    {this.state.error?.toString()}
                </p>
                <Button onClick={() => window.location.reload()}>刷新页面</Button>
            </div>
        );
    }
}

'use client';

import React from 'react';
import '@/styles/longform.css';

interface LongformContainerProps {
    children: React.ReactNode;
    className?: string;
}

export function LongformContainer({ children, className = '' }: LongformContainerProps) {
    return <div className={`longform-content ${className}`}>{children}</div>;
}

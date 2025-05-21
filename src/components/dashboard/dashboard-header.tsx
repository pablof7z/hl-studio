import { PostTypeDropdown } from '@/components/posts/post-type-dropdown';
import { cn } from '@/lib/utils';
import type React from 'react';

interface DashboardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    heading: string;
    text?: string;
    children?: React.ReactNode;
    showNewPostButton?: boolean;
}

export function DashboardHeader({
    heading,
    text,
    children,
    className,
    showNewPostButton = false,
    ...props
}: DashboardHeaderProps) {
    return (
        <div className={cn('flex items-center justify-between', className)} {...props}>
            <div className="grid gap-1">
                <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
                {text && <p className="text-muted-foreground">{text}</p>}
            </div>
            <div className="flex items-center gap-2">
                {showNewPostButton && <PostTypeDropdown />}
                {children}
            </div>
        </div>
    );
}

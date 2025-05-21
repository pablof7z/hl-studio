import { cn } from '@/lib/utils';
import type React from 'react';

type DashboardShellProps = React.HTMLAttributes<HTMLDivElement>;

export function DashboardShell({ children, className, ...props }: DashboardShellProps) {
    return (
        <div className={cn('grid items-start gap-8 w-full', className)} {...props}>
            {children}
        </div>
    );
}

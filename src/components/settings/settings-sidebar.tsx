'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Cog, CreditCard, Mail, MessageSquare, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type React from 'react';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
    items?: {
        href: string;
        title: string;
        icon: React.ReactNode;
    }[];
}

export function SettingsSidebar({ className, items, ...props }: SidebarNavProps) {
    const pathname = usePathname();

    const defaultItems = [
        {
            href: '/settings/publication',
            title: 'Publication',
            icon: <Settings className="mr-2 h-4 w-4" />,
        },
        {
            href: '/settings/payments',
            title: 'Payments',
            icon: <CreditCard className="mr-2 h-4 w-4" />,
        },
        {
            href: '/settings/team',
            title: 'Team',
            icon: <Users className="mr-2 h-4 w-4" />,
        },
        {
            href: '/settings/email',
            title: 'Email',
            icon: <Mail className="mr-2 h-4 w-4" />,
        },
        {
            href: '/settings/comments',
            title: 'Comments',
            icon: <MessageSquare className="mr-2 h-4 w-4" />,
        },
        {
            href: '/settings/advanced',
            title: 'Advanced',
            icon: <Cog className="mr-2 h-4 w-4" />,
        },
    ];

    const navItems = items || defaultItems;

    return (
        <nav className={cn('flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1', className)} {...props}>
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        buttonVariants({ variant: 'ghost' }),
                        pathname === item.href ? 'bg-muted hover:bg-muted' : 'hover:bg-transparent hover:underline',
                        'justify-start'
                    )}
                >
                    {item.icon}
                    {item.title}
                </Link>
            ))}
        </nav>
    );
}

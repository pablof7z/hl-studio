import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type React from 'react';

type TopPerformersProps = React.HTMLAttributes<HTMLDivElement>;

export function TopPerformers({ className, ...props }: TopPerformersProps) {
    const topPosts = [
        {
            title: 'The Future of Content Creation',
            views: 12845,
            engagement: '24.8%',
        },
        {
            title: 'How I Grew My Newsletter to 10K Subscribers',
            views: 8932,
            engagement: '22.3%',
        },
        {
            title: '5 Writing Tips That Changed My Career',
            views: 7621,
            engagement: '19.7%',
        },
        {
            title: 'The Creator Economy in 2025',
            views: 6543,
            engagement: '18.2%',
        },
        {
            title: 'Why Consistency Matters More Than Talent',
            views: 5487,
            engagement: '17.5%',
        },
    ];

    return (
        <Card className={cn('col-span-3', className)} {...props}>
            <CardHeader>
                <CardTitle>Top Performing Posts</CardTitle>
                <CardDescription>Your most viewed and engaged content</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {topPosts.map((post, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">{post.title}</p>
                                <p className="text-sm text-muted-foreground">{post.views.toLocaleString()} views</p>
                            </div>
                            <div className="ml-auto font-medium text-green-500">{post.engagement}</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

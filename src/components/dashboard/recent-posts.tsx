import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Eye } from 'lucide-react';

export function RecentPosts() {
    const recentPosts = [
        {
            title: 'The Creator Economy in 2025',
            status: 'Published',
            date: 'Sep 28, 2023',
            views: 6543,
        },
        {
            title: 'Why Consistency Matters More Than Talent',
            status: 'Published',
            date: 'Sep 21, 2023',
            views: 5487,
        },
        {
            title: 'Building a Personal Brand Online',
            status: 'Draft',
            date: 'Sep 18, 2023',
            views: 0,
        },
        {
            title: 'Monetization Strategies for Creators',
            status: 'Draft',
            date: 'Sep 15, 2023',
            views: 0,
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Posts</CardTitle>
                <CardDescription>Your recently published and drafted content</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentPosts.map((post, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium leading-none">{post.title}</p>
                                    <Badge variant={post.status === 'Published' ? 'default' : 'outline'}>
                                        {post.status}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {post.date} •{' '}
                                    {post.status === 'Published'
                                        ? `${post.views.toLocaleString()} views`
                                        : 'Not published'}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                </Button>
                                {post.status === 'Published' && (
                                    <Button variant="ghost" size="icon">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

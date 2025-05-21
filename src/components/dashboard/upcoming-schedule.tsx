import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar, Clock, Edit, Facebook, Linkedin, Mail, Twitter } from 'lucide-react';

export function UpcomingSchedule() {
    const scheduledPosts = [
        {
            id: '1',
            title: 'How to Build a Loyal Audience',
            date: 'Oct 5, 2023',
            time: '9:00 AM',
            timezone: 'America/New_York',
            status: 'Scheduled',
            type: 'long-form',
            audienceType: 'all',
            distribution: {
                email: true,
                twitter: true,
                linkedin: false,
                facebook: false,
            },
        },
        {
            id: '2',
            title: 'Content Creation Tools I Use Daily',
            date: 'Oct 12, 2023',
            time: '9:00 AM',
            timezone: 'America/New_York',
            status: 'Scheduled',
            type: 'thread',
            audienceType: 'paid',
            distribution: {
                email: true,
                twitter: true,
                linkedin: true,
                facebook: false,
            },
        },
        {
            id: '3',
            title: 'Balancing Quality and Quantity',
            date: 'Oct 19, 2023',
            time: '9:00 AM',
            timezone: 'America/New_York',
            status: 'Scheduled',
            type: 'long-form',
            audienceType: 'free',
            distribution: {
                email: true,
                twitter: false,
                linkedin: false,
                facebook: false,
            },
        },
        {
            id: '4',
            title: 'Engaging With Your Community',
            date: 'Oct 26, 2023',
            time: '9:00 AM',
            timezone: 'America/New_York',
            status: 'Scheduled',
            type: 'thread',
            audienceType: 'all',
            distribution: {
                email: true,
                twitter: true,
                linkedin: true,
                facebook: true,
            },
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Upcoming Schedule</CardTitle>
                <CardDescription>Your scheduled posts for publication</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {scheduledPosts.map((post, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">{post.title}</p>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>{post.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>{post.time}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                        {post.type === 'long-form' ? 'Long-form' : 'Thread'}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        {post.audienceType === 'all'
                                            ? 'All subscribers'
                                            : post.audienceType === 'paid'
                                              ? 'Paid subscribers'
                                              : 'Free subscribers'}
                                    </Badge>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="flex items-center gap-1">
                                                    {post.distribution.email && (
                                                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                                    )}
                                                    {post.distribution.twitter && (
                                                        <Twitter className="h-3.5 w-3.5 text-muted-foreground" />
                                                    )}
                                                    {post.distribution.linkedin && (
                                                        <Linkedin className="h-3.5 w-3.5 text-muted-foreground" />
                                                    )}
                                                    {post.distribution.facebook && (
                                                        <Facebook className="h-3.5 w-3.5 text-muted-foreground" />
                                                    )}
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="text-xs">Distribution channels:</p>
                                                <ul className="text-xs">
                                                    {post.distribution.email && <li>Email to subscribers</li>}
                                                    {post.distribution.twitter && <li>Twitter</li>}
                                                    {post.distribution.linkedin && <li>LinkedIn</li>}
                                                    {post.distribution.facebook && <li>Facebook</li>}
                                                </ul>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline">{post.status}</Badge>
                                <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

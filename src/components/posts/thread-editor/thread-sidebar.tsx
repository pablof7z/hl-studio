'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, Clock, FileText, Plus, Search } from 'lucide-react';
import { useState } from 'react';

export function ThreadSidebar() {
    const [activeTab, setActiveTab] = useState<'drafts' | 'scheduled' | 'posted'>('drafts');

    const drafts = [
        {
            id: '1',
            title: 'Building an audience is a great investment that compounds over...',
            platform: 'twitter',
            updatedAt: '2 hours ago',
        },
        {
            id: '2',
            title: '10 tips for better content creation',
            platform: 'twitter',
            updatedAt: 'Yesterday',
        },
        {
            id: '3',
            title: 'How to grow your newsletter to 1000 subscribers',
            platform: 'twitter',
            updatedAt: '3 days ago',
        },
    ];

    const scheduled = [
        {
            id: '4',
            title: 'The power of consistency in content creation',
            platform: 'twitter',
            scheduledFor: 'Tomorrow, 9:00 AM',
        },
        {
            id: '5',
            title: '5 tools every creator should use',
            platform: 'twitter',
            scheduledFor: 'May 15, 9:00 AM',
        },
    ];

    const posted = [
        {
            id: '6',
            title: 'Why building in public works so well',
            platform: 'twitter',
            postedAt: 'Apr 28',
        },
        {
            id: '7',
            title: 'The creator economy in 2025',
            platform: 'twitter',
            postedAt: 'Apr 21',
        },
    ];

    return (
        <div className="hidden w-64 flex-col border-r md:flex">
            <div className="flex items-center justify-between border-b p-4">
                <div className="text-lg font-semibold">Threads</div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            <div className="border-b p-4">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search..." className="pl-8" />
                </div>
            </div>

            <div className="flex border-b">
                <button
                    className={`flex-1 border-b-2 p-2 text-sm font-medium ${
                        activeTab === 'drafts' ? 'border-primary' : 'border-transparent text-muted-foreground'
                    }`}
                    onClick={() => setActiveTab('drafts')}
                >
                    Drafts
                </button>
                <button
                    className={`flex-1 border-b-2 p-2 text-sm font-medium ${
                        activeTab === 'scheduled' ? 'border-primary' : 'border-transparent text-muted-foreground'
                    }`}
                    onClick={() => setActiveTab('scheduled')}
                >
                    Scheduled
                </button>
                <button
                    className={`flex-1 border-b-2 p-2 text-sm font-medium ${
                        activeTab === 'posted' ? 'border-primary' : 'border-transparent text-muted-foreground'
                    }`}
                    onClick={() => setActiveTab('posted')}
                >
                    Posted
                </button>
            </div>

            <ScrollArea className="flex-1">
                {activeTab === 'drafts' && (
                    <div className="space-y-1 p-2">
                        <Button variant="ghost" className="h-auto w-full justify-start p-2 text-left">
                            <div className="mr-2 rounded-full bg-primary/10 p-1">
                                <Plus className="h-4 w-4 text-primary" />
                            </div>
                            <span>New draft</span>
                        </Button>

                        {drafts.map((draft) => (
                            <Button
                                key={draft.id}
                                variant="ghost"
                                className="h-auto w-full justify-start p-2 text-left"
                            >
                                <div className="mr-2 rounded-full bg-muted p-1">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="line-clamp-1 text-sm">{draft.title}</span>
                                    <span className="text-xs text-muted-foreground">Updated {draft.updatedAt}</span>
                                </div>
                            </Button>
                        ))}
                    </div>
                )}

                {activeTab === 'scheduled' && (
                    <div className="space-y-1 p-2">
                        {scheduled.map((item) => (
                            <Button key={item.id} variant="ghost" className="h-auto w-full justify-start p-2 text-left">
                                <div className="mr-2 rounded-full bg-muted p-1">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="line-clamp-1 text-sm">{item.title}</span>
                                    <span className="text-xs text-muted-foreground">{item.scheduledFor}</span>
                                </div>
                            </Button>
                        ))}
                    </div>
                )}

                {activeTab === 'posted' && (
                    <div className="space-y-1 p-2">
                        {posted.map((item) => (
                            <Button key={item.id} variant="ghost" className="h-auto w-full justify-start p-2 text-left">
                                <div className="mr-2 rounded-full bg-muted p-1">
                                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="line-clamp-1 text-sm">{item.title}</span>
                                    <span className="text-xs text-muted-foreground">Posted on {item.postedAt}</span>
                                </div>
                            </Button>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}

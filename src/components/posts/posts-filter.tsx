'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Search, SlidersHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';

export function PostsFilter() {
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['all']);

    const handleStatusChange = (status: string) => {
        setSelectedStatuses((prev) => {
            // If "all" is being selected, return only "all"
            if (status === 'all') return ['all'];

            // Create a new array without "all" and toggle the selected status
            const withoutAll = prev.filter((s) => s !== 'all');
            const newStatuses = withoutAll.includes(status)
                ? withoutAll.filter((s) => s !== status)
                : [...withoutAll, status];

            // If no statuses are selected, default to "all"
            return newStatuses.length ? newStatuses : ['all'];
        });
    };

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-2">
                <div className="relative flex-1 sm:max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search posts..." className="w-full pl-8" />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                            <span className="sr-only">Filter</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                            checked={selectedStatuses.includes('all')}
                            onCheckedChange={() => handleStatusChange('all')}
                        >
                            All Posts
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={selectedStatuses.includes('published')}
                            onCheckedChange={() => handleStatusChange('published')}
                        >
                            Published
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={selectedStatuses.includes('draft')}
                            onCheckedChange={() => handleStatusChange('draft')}
                        >
                            Drafts
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={selectedStatuses.includes('scheduled')}
                            onCheckedChange={() => handleStatusChange('scheduled')}
                        >
                            Scheduled
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={selectedStatuses.includes('archived')}
                            onCheckedChange={() => handleStatusChange('archived')}
                        >
                            Archived
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Select defaultValue="newest">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="popular">Most Popular</SelectItem>
                        <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                        <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center gap-2"></div>
        </div>
    );
}

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockSubscribers } from '@/data/mock-subscribers';
import { MoreHorizontal, Search, X } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

export function SubscribersList() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredSubscribers, setFilteredSubscribers] = useState(mockSubscribers);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim() === '') {
            setFilteredSubscribers(mockSubscribers);
        } else {
            const filtered = mockSubscribers.filter(
                (subscriber) =>
                    subscriber.name?.toLowerCase().includes(query.toLowerCase()) ||
                    subscriber.email?.toLowerCase().includes(query.toLowerCase()) ||
                    subscriber.npub?.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredSubscribers(filtered);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setFilteredSubscribers(mockSubscribers);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search subscribers..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    {searchQuery && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-9 w-9 p-0"
                            onClick={clearSearch}
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Clear search</span>
                        </Button>
                    )}
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Nostr</TableHead>
                            <TableHead>Subscription</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredSubscribers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No subscribers found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredSubscribers.map((subscriber) => (
                                <TableRow key={subscriber.id}>
                                    <TableCell className="font-medium">{subscriber.name || '—'}</TableCell>
                                    <TableCell>{subscriber.email || '—'}</TableCell>
                                    <TableCell>
                                        {subscriber.npub ? (
                                            <span className="text-xs font-mono">
                                                {subscriber.npub.substring(0, 8)}...
                                                {subscriber.npub.substring(subscriber.npub.length - 4)}
                                            </span>
                                        ) : (
                                            '—'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={subscriber.tier === 'paid' ? 'default' : 'secondary'}>
                                            {subscriber.tier === 'paid' ? 'Paid' : 'Free'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{subscriber.joinedAt}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>View details</DropdownMenuItem>
                                                <DropdownMenuItem>Edit subscriber</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive">
                                                    Remove subscriber
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

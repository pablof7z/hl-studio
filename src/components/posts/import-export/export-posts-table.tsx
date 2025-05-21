'use client';

import { PostStatusBadge } from '@/components/posts/post-status-badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Filter, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ExportPostsTableProps {
    onSelectionChange: (selectedPosts: string[]) => void;
}

export function ExportPostsTable({ onSelectionChange }: ExportPostsTableProps) {
    // Sample data for posts
    const posts = [
        {
            id: '1',
            title: 'The Future of Content Creation',
            status: 'published',
            publishedAt: '2023-09-28T09:00:00Z',
            views: 12845,
        },
        {
            id: '2',
            title: 'How I Grew My Newsletter to 10K Subscribers',
            status: 'published',
            publishedAt: '2023-09-21T09:00:00Z',
            views: 8932,
        },
        {
            id: '3',
            title: '5 Writing Tips That Changed My Career',
            status: 'published',
            publishedAt: '2023-09-14T09:00:00Z',
            views: 7621,
        },
        {
            id: '4',
            title: 'Building a Personal Brand Online',
            status: 'draft',
            updatedAt: '2023-09-18T14:23:00Z',
        },
        {
            id: '5',
            title: 'Monetization Strategies for Creators',
            status: 'draft',
            updatedAt: '2023-09-15T11:45:00Z',
        },
        {
            id: '6',
            title: 'How to Build a Loyal Audience',
            status: 'scheduled',
            scheduledFor: '2023-10-05T09:00:00Z',
        },
        {
            id: '7',
            title: 'Content Creation Tools I Use Daily',
            status: 'scheduled',
            scheduledFor: '2023-10-12T09:00:00Z',
        },
        {
            id: '8',
            title: 'The Creator Economy in 2025',
            status: 'archived',
            archivedAt: '2023-08-30T15:20:00Z',
            views: 6543,
        },
    ];

    const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const toggleSelectAll = () => {
        if (selectedPosts.length === filteredPosts.length) {
            setSelectedPosts([]);
        } else {
            setSelectedPosts(filteredPosts.map((post) => post.id));
        }
    };

    const toggleSelectPost = (id: string) => {
        if (selectedPosts.includes(id)) {
            setSelectedPosts(selectedPosts.filter((postId) => postId !== id));
        } else {
            setSelectedPosts([...selectedPosts, id]);
        }
    };

    // Filter posts based on status and search query
    const filteredPosts = posts.filter((post) => {
        const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // Update parent component when selection changes
    useEffect(() => {
        onSelectionChange(selectedPosts);
    }, [selectedPosts, onSelectionChange]);

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1 sm:max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search posts..."
                        className="w-full pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Posts</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="draft">Drafts</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPosts(filteredPosts.map((post) => post.id))}
                >
                    Select All Filtered
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                                    onCheckedChange={toggleSelectAll}
                                    aria-label="Select all posts"
                                />
                            </TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="hidden md:table-cell">Views</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPosts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No posts found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPosts.map((post) => (
                                <TableRow key={post.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedPosts.includes(post.id)}
                                            onCheckedChange={() => toggleSelectPost(post.id)}
                                            aria-label={`Select ${post.title}`}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{post.title}</TableCell>
                                    <TableCell>
                                        <PostStatusBadge status={post.status} />
                                    </TableCell>
                                    <TableCell>
                                        {post.publishedAt && formatDate(post.publishedAt)}
                                        {post.updatedAt && formatDate(post.updatedAt)}
                                        {post.scheduledFor && formatDate(post.scheduledFor)}
                                        {post.archivedAt && formatDate(post.archivedAt)}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {post.views ? post.views.toLocaleString() : '-'}
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

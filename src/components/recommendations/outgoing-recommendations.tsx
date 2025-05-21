'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockOutgoingRecommendations } from '@/data/mock-recommendations';
import { ChevronDown, ChevronUp, MoreHorizontal, Plus } from 'lucide-react';
import { useState } from 'react';

interface OutgoingRecommendationsProps {
    onAddRecommendation: () => void;
}

export function OutgoingRecommendations({ onAddRecommendation }: OutgoingRecommendationsProps) {
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [sortBy, setSortBy] = useState<'name' | 'subscribers'>('subscribers');

    const handleSort = (column: 'name' | 'subscribers') => {
        if (sortBy === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortDirection('desc');
        }
    };

    const sortedRecommendations = [...mockOutgoingRecommendations].sort((a, b) => {
        if (sortBy === 'name') {
            return sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else {
            return sortDirection === 'asc'
                ? a.subscribersSent - b.subscribersSent
                : b.subscribersSent - a.subscribersSent;
        }
    });

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Outgoing recommendations</CardTitle>
                    <CardDescription>Publications that you recommend</CardDescription>
                </div>
                <Button onClick={onAddRecommendation}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add recommendation
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[300px]">
                                <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort('name')}>
                                    Publication
                                    {sortBy === 'name' && (
                                        <span className="ml-2">
                                            {sortDirection === 'asc' ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            )}
                                        </span>
                                    )}
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    className="p-0 font-medium"
                                    onClick={() => handleSort('subscribers')}
                                >
                                    Subscribers sent
                                    {sortBy === 'subscribers' && (
                                        <span className="ml-2">
                                            {sortDirection === 'asc' ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            )}
                                        </span>
                                    )}
                                </Button>
                            </TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedRecommendations.map((recommendation) => (
                            <TableRow key={recommendation.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage
                                                src={recommendation.avatar || '/placeholder.svg'}
                                                alt={recommendation.name}
                                            />
                                            <AvatarFallback>{recommendation.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{recommendation.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                By {recommendation.author}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{recommendation.subscribersSent}</TableCell>
                                <TableCell>
                                    <Badge variant={recommendation.status === 'Active' ? 'default' : 'outline'}>
                                        {recommendation.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Open menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>Edit recommendation</DropdownMenuItem>
                                            <DropdownMenuItem>View analytics</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">
                                                Remove recommendation
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {sortedRecommendations.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    You haven&amp;apos;t recommended any publications yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <div className="mt-4 flex justify-end text-sm text-muted-foreground">
                    {sortedRecommendations.length > 0 && (
                        <div>
                            1-{sortedRecommendations.length} of {sortedRecommendations.length}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

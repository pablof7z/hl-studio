'use client';

import { PostStatusBadge } from '@/components/posts/post-status-badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useArticles } from '@/domains/articles';
import { usePostDelete } from '@/features/post/hooks/use-post-delete';
import { formatDate } from '@/lib/utils';
import { NDKArticle, NDKEvent } from '@nostr-dev-kit/ndk';
import {
    Archive, Calendar,
    Clock,
    Copy,
    Edit,
    Eye,
    FileText,
    MoreHorizontal,
    Trash2
} from 'lucide-react';
import Link from 'next/link';

function ArticleTableRow({ article, event, status, created_at, counterparty }: { article: NDKArticle; event: NDKEvent; status: string; created_at: number; counterparty?: string }) {
    const deletePost = usePostDelete();
    
    return (
        <TableRow key={event.id}>
            <TableCell>
                <Link href={{ pathname: '/editor/post', query: { id: event.encode() } }}>
                <div className="flex flex-row gap-2">
                    {article.image ? (
                        <img
                            src={article.image}
                            className="h-10 w-10 rounded-md object-cover bg-muted"
                        />
                    ) : (
                        <div className="h-10 w-10 bg-muted rounded-md flex-none"></div>
                    )}
                    <div className="flex flex-col">
                        <span className="font-medium">{article.title}</span>
                        <span className="hidden text-sm text-muted-foreground sm:block">
                            {article.summary?.slice(0, 100)}
                        </span>
                        {(status === 'incoming_proposal' || status === 'outgoing_proposal') && counterparty && (
                            <span className="text-xs text-blue-600 mt-1">
                                {status === 'incoming_proposal' ? 'From: ' : 'To: '}
                                {counterparty.slice(0, 8)}...{counterparty.slice(-4)}
                            </span>
                        )}
                    </div>
                </div>
                </Link>
            </TableCell>
            <TableCell className="hidden md:table-cell">
                <PostStatusBadge status={status} />
            </TableCell>
            <TableCell className="hidden md:table-cell">
                {status === 'published' && (
                    <div className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">
                            {article.published_at ? formatDate(article.published_at) : '-'}
                        </span>
                    </div>
                )}
                {(status === 'draft' || status === 'incoming_proposal' || status === 'outgoing_proposal') && (
                    <div className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">
                            Updated {created_at ? formatDate(created_at) : '-'}
                        </span>
                    </div>
                )}
                {status === 'scheduled' && (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">
                                {article.created_at? formatDate(article.created_at) : '-'}
                            </span>
                        </div>
                    </div>
                )}
                {status === 'archived' && (
                    <div className="flex items-center gap-1">
                        <Archive className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">
                            {article.created_at ? formatDate(article.created_at) : '-'}
                        </span>
                    </div>
                )}
            </TableCell>
            <TableCell>
                <TooltipProvider>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href={{ pathname: '/editor/post', query: { id: event.encode() } }}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            {status === 'published' && (
                                <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                </DropdownMenuItem>
                            )}
                            {status === 'scheduled' && (
                                <DropdownMenuItem>
                                    <Clock className="mr-2 h-4 w-4" />
                                    Edit Schedule
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(event.inspect)}
                            >
                                <Copy className="mr-2 h-4 w-4" />
                                Copy raw event
                            </DropdownMenuItem>
                            {status !== 'archived' ? (
                                <DropdownMenuItem>
                                    <Archive className="mr-2 h-4 w-4" />
                                    Archive
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Restore
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => deletePost(event)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TooltipProvider>
            </TableCell>
        </TableRow>
    )
}

export function PostsTable() {
    const articles = useArticles();

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="min-w-[300px]">Title</TableHead>
                        <TableHead className="hidden md:table-cell">Status</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead className="w-12"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {articles.map(({ article, event, status, created_at, counterparty }) => (
                        <ArticleTableRow
                            key={event.id}
                            event={event}
                            article={article}
                            status={status}
                            created_at={created_at}
                            counterparty={counterparty}
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

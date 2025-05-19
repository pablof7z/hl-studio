"use client"

import Link from "next/link";

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  BarChart2,
  Copy,
  Edit,
  Eye,
  MoreHorizontal,
  Trash2,
  Archive,
  Clock,
  FileText,
  MessageCircle,
  Calendar,
} from "lucide-react"
import { PostStatusBadge } from "@/components/posts/post-status-badge"
import { formatDate } from "@/lib/utils"
import { NDKArticle, NDKEvent, NDKKind, useNDKCurrentPubkey, useSubscribe } from "@nostr-dev-kit/ndk-hooks"
import { useArticles, useArticlesStore } from "@/domains/articles"

export function PostsTable() {
  const articles = useArticles();

  console.log('articles in post table', articles);
  console.log('articles in post table', articles[0] instanceof NDKArticle);
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[300px]">Title</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead className="hidden lg:table-cell">Performance</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map(({article: post, status }) => (
            <TableRow key={post.id}>
              <TableCell>
                <div className="flex flex-row gap-2">
                  {post.image ? (
                    <img src={post.image} alt={post.title} className="h-10 w-10 rounded-md object-cover bg-muted" />
                  ) : (
                    <div className="h-10 w-10"></div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium">{post.title}</span>
                    <span className="hidden text-sm text-muted-foreground sm:block">{post.summary}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <PostStatusBadge status={status} />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {status === "published" && (
                  <div className="flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm">
                      {post.published_at ? formatDate(post.published_at) : "-"}
                    </span>
                  </div>
                )}
                {status === "draft" && (
                  <div className="flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm">
                      Updated {post.created_at ? formatDate(post.created_at) : "-"}
                    </span>
                  </div>
                )}
                {status === "scheduled" && (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">
                        {post.scheduledFor ? formatDate(post.scheduledFor) : "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">{post.scheduledTime}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {post.audienceType === "all"
                        ? "All subscribers"
                        : post.audienceType === "paid"
                          ? "Paid subscribers"
                          : "Free subscribers"}
                    </div>
                  </div>
                )}
                {status === 'archived' && (
                  <div className="flex items-center gap-1">
                    <Archive className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm">
                      {post.archivedAt ? formatDate(post.archivedAt) : "-"}
                    </span>
                  </div>
                )}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {status === "published" || post.hasTag("deleted") ? (
                  <div className="flex items-center gap-4">
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Not published</span>
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
                        <Link href={{ pathname: "/editor/post", query: { id: post.encode() } }}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      {status === "published" && (
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                      )}
                      {status === "scheduled" && (
                        <DropdownMenuItem>
                          <Clock className="mr-2 h-4 w-4" />
                          Edit Schedule
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigator.clipboard.writeText(post.inspect)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy raw event
                      </DropdownMenuItem>
                      {status !== "archived" ? (
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
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => post.delete()}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

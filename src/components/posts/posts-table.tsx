"use client"

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
import { NDKArticle, NDKKind, useNDKCurrentPubkey, useSubscribe } from "@nostr-dev-kit/ndk-hooks"
import { useArticles, useArticlesStore } from "@/domains/articles"

// Sample data for posts
const posts = [
  {
    id: "1",
    title: "The Future of Content Creation",
    excerpt: "Exploring how AI and new tools are changing the landscape for creators...",
    status: "published",
    published_at: "2023-09-28T09:00:00Z",
    views: 12845,
    comments: 48,
    likes: 342,
  },
  {
    id: "2",
    title: "How I Grew My Newsletter to 10K Subscribers",
    excerpt: "The strategies and tactics that helped me reach this milestone...",
    status: "published",
    published_at: "2023-09-21T09:00:00Z",
    views: 8932,
    comments: 36,
    likes: 287,
  },
  {
    id: "3",
    title: "5 Writing Tips That Changed My Career",
    excerpt: "Simple but effective techniques to improve your writing immediately...",
    status: "published",
    published_at: "2023-09-14T09:00:00Z",
    views: 7621,
    comments: 29,
    likes: 215,
  },
  {
    id: "4",
    title: "Building a Personal Brand Online",
    excerpt: "How to establish yourself as an authority in your niche...",
    status: "draft",
    created_at: "2023-09-18T14:23:00Z",
  },
  {
    id: "5",
    title: "Monetization Strategies for Creators",
    excerpt: "Different ways to turn your content into a sustainable income...",
    status: "draft",
    created_at: "2023-09-15T11:45:00Z",
  },
  {
    id: "6",
    title: "How to Build a Loyal Audience",
    excerpt: "Strategies for creating a community that keeps coming back...",
    status: "scheduled",
    scheduledFor: "2023-10-05T09:00:00Z",
    scheduledTime: "09:00",
    scheduledTimezone: "America/New_York",
    audienceType: "all",
    sendEmail: true,
    socialShare: { twitter: true, linkedin: false, facebook: false },
  },
  {
    id: "7",
    title: "Content Creation Tools I Use Daily",
    excerpt: "A breakdown of the software and services that power my workflow...",
    status: "scheduled",
    scheduledFor: "2023-10-12T09:00:00Z",
    scheduledTime: "10:30",
    scheduledTimezone: "America/New_York",
    audienceType: "paid",
    sendEmail: true,
    socialShare: { twitter: true, linkedin: true, facebook: false },
  },
  {
    id: "8",
    title: "The Creator Economy in 2025",
    excerpt: "Predictions and trends that will shape the future for content creators...",
    status: "archived",
    archivedAt: "2023-08-30T15:20:00Z",
    views: 6543,
    comments: 24,
    likes: 178,
  },
]

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
            <TableHead className="hidden lg:table-cell">Performance</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((post) => (
            <TableRow key={post.id}>
              <TableCell>
                <div className="flex flex-row gap-2">
                  <img src={post.image} alt={post.title} className="h-10 w-10 rounded-md object-cover" />
                  <div className="flex flex-col">
                    <span className="font-medium">{post.title}</span>
                    <span className="hidden text-sm text-muted-foreground sm:block">{post.summary}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <PostStatusBadge status={post.status} />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {post.status === "published" && (
                  <div className="flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm">
                      {post.published_at ? formatDate(post.published_at) : "-"}
                    </span>
                  </div>
                )}
                {post.status === "draft" && (
                  <div className="flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm">
                      Updated {post.created_at ? formatDate(post.created_at) : "-"}
                    </span>
                  </div>
                )}
                {post.status === "scheduled" && (
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
                {post.hasTag("deleted") && (
                  <div className="flex items-center gap-1">
                    <Archive className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm">
                      {post.archivedAt ? formatDate(post.archivedAt) : "-"}
                    </span>
                  </div>
                )}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {post.status === "published" || post.hasTag("deleted") ? (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">
                        {typeof post.views === "number" ? post.views.toLocaleString() : "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">{post.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">
                        {typeof post.views === "number" && typeof post.comments === "number" && post.views > 0
                          ? ((post.comments / post.views) * 100).toFixed(1)
                          : "0.0"}
                        %
                      </span>
                    </div>
                  </div>
                ) : post.status === "scheduled" ? (
                  <div className="flex items-center gap-1">
                    {post.sendEmail && <span className="text-xs bg-muted px-2 py-0.5 rounded-full">Email</span>}
                    {post.socialShare?.twitter && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full">Twitter</span>
                    )}
                    {post.socialShare?.linkedin && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full">LinkedIn</span>
                    )}
                    {post.socialShare?.facebook && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full">Facebook</span>
                    )}
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
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      {post.status === "published" && (
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                      )}
                      {post.status === "scheduled" && (
                        <DropdownMenuItem>
                          <Clock className="mr-2 h-4 w-4" />
                          Edit Schedule
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      {post.status !== "archived" ? (
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
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
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

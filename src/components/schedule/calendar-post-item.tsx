"use client"

import { FileText, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ScheduledPost } from "@/data/mock-scheduled-posts"

interface CalendarPostItemProps {
  post: ScheduledPost
  onClick: () => void
  compact?: boolean
  expanded?: boolean
}

export function CalendarPostItem({ post, onClick, compact, expanded }: CalendarPostItemProps) {
  const TypeIcon = post.type === "long-form" ? FileText : MessageSquare

  // Determine background color based on post type and audience
  const getBgColor = () => {
    if (post.type === "long-form") {
      return post.audienceType === "paid"
        ? "bg-blue-100 hover:bg-blue-200 border-blue-200 dark:bg-blue-950/30 dark:hover:bg-blue-950/50 dark:border-blue-900/50"
        : "bg-indigo-100 hover:bg-indigo-200 border-indigo-200 dark:bg-indigo-950/30 dark:hover:bg-indigo-950/50 dark:border-indigo-900/50"
    } else {
      return post.audienceType === "paid"
        ? "bg-green-100 hover:bg-green-200 border-green-200 dark:bg-green-950/30 dark:hover:bg-green-950/50 dark:border-green-900/50"
        : "bg-emerald-100 hover:bg-emerald-200 border-emerald-200 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 dark:border-emerald-900/50"
    }
  }

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={cn("w-full text-left rounded px-1.5 py-0.5 text-xs border cursor-pointer truncate", getBgColor())}
      >
        <div className="flex items-center gap-1">
          <TypeIcon className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{post.title}</span>
        </div>
      </button>
    )
  }

  if (expanded) {
    return (
      <button
        onClick={onClick}
        className={cn("w-full text-left rounded p-2 text-sm border cursor-pointer", getBgColor())}
      >
        <div className="flex items-center gap-2 mb-1">
          <TypeIcon className="h-4 w-4 flex-shrink-0" />
          <span className="font-medium">{post.title}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span>{post.scheduledTime}</span>
          <span className="capitalize">{post.audienceType} subscribers</span>
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={cn("w-full text-left rounded p-1.5 text-xs border cursor-pointer", getBgColor())}
    >
      <div className="flex items-center gap-1 mb-0.5">
        <TypeIcon className="h-3 w-3 flex-shrink-0" />
        <span className="font-medium truncate">{post.title}</span>
      </div>
      <div className="text-xs opacity-80">{post.scheduledTime}</div>
    </button>
  )
}

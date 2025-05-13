"use client"

import { useState } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO,
  isToday,
  startOfWeek,
  addDays,
} from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarPostItem } from "@/components/schedule/calendar-post-item"
import { PostDetailsDialog } from "@/components/schedule/post-details-dialog"
import type { ScheduledPost } from "@/data/mock-scheduled-posts"

interface CalendarMonthViewProps {
  currentDate: Date
  posts: ScheduledPost[]
}

export function CalendarMonthView({ currentDate, posts }: CalendarMonthViewProps) {
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const startDate = startOfWeek(monthStart)
  const days = eachDayOfInterval({ start: startDate, end: monthEnd })

  // Add days to complete the grid (6 weeks)
  while (days.length < 42) {
    days.push(addDays(days[days.length - 1], 1))
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="grid grid-cols-7 h-[calc(100vh-250px)] min-h-[600px]">
      {/* Header row with day names */}
      {weekDays.map((day) => (
        <div key={day} className="p-2 text-center font-medium border-b">
          {day}
        </div>
      ))}

      {/* Calendar days */}
      {days.map((day) => {
        // Get posts for this day
        const dayPosts = posts.filter((post) => isSameDay(parseISO(post.scheduledFor), day))

        return (
          <div
            key={day.toString()}
            className={cn(
              "border-r border-b p-1 overflow-hidden",
              !isSameMonth(day, monthStart) && "bg-muted/50 text-muted-foreground",
              isToday(day) && "bg-blue-50 dark:bg-blue-950/20",
            )}
          >
            <div className="flex justify-between items-start">
              <span
                className={cn(
                  "inline-flex h-6 w-6 items-center justify-center rounded-full text-sm",
                  isToday(day) && "bg-primary text-primary-foreground font-medium",
                )}
              >
                {format(day, "d")}
              </span>
              {dayPosts.length > 3 && (
                <span className="text-xs text-muted-foreground">+{dayPosts.length - 3} more</span>
              )}
            </div>

            <div className="mt-1 space-y-1 max-h-[calc(100%-2rem)] overflow-y-auto">
              {dayPosts.slice(0, 3).map((post) => (
                <CalendarPostItem key={post.id} post={post} onClick={() => setSelectedPost(post)} />
              ))}
            </div>
          </div>
        )
      })}

      {selectedPost && (
        <PostDetailsDialog post={selectedPost} open={!!selectedPost} onOpenChange={() => setSelectedPost(null)} />
      )}
    </div>
  )
}

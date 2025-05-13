"use client"

import { useState } from "react"
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  parseISO,
  isToday,
  addHours,
  startOfDay,
} from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarPostItem } from "@/components/schedule/calendar-post-item"
import { PostDetailsDialog } from "@/components/schedule/post-details-dialog"
import type { ScheduledPost } from "@/data/mock-scheduled-posts"

interface CalendarWeekViewProps {
  currentDate: Date
  posts: ScheduledPost[]
}

export function CalendarWeekView({ currentDate, posts }: CalendarWeekViewProps) {
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null)

  const weekStart = startOfWeek(currentDate)
  const weekEnd = endOfWeek(currentDate)
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Create time slots for each hour from 7 AM to 9 PM
  const timeSlots = Array.from({ length: 15 }, (_, i) => addHours(startOfDay(currentDate), i + 7))

  return (
    <div className="flex flex-col h-[calc(100vh-250px)] min-h-[600px]">
      <div className="grid grid-cols-8 border-b">
        {/* Empty cell for time column */}
        <div className="p-2 border-r"></div>

        {/* Day headers */}
        {days.map((day) => (
          <div
            key={day.toString()}
            className={cn("p-2 text-center font-medium", isToday(day) && "bg-blue-50 dark:bg-blue-950/20")}
          >
            <div>{format(day, "EEE")}</div>
            <div
              className={cn(
                "inline-flex h-6 w-6 items-center justify-center rounded-full text-sm",
                isToday(day) && "bg-primary text-primary-foreground",
              )}
            >
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-8">
          {/* Time slots */}
          <div className="border-r">
            {timeSlots.map((time) => (
              <div key={time.toString()} className="h-20 border-b p-1 text-xs text-right pr-2 text-muted-foreground">
                {format(time, "h a")}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day) => {
            return (
              <div key={day.toString()} className="relative border-r">
                {/* Time slot backgrounds */}
                {timeSlots.map((time) => (
                  <div
                    key={time.toString()}
                    className={cn("h-20 border-b", isToday(day) && "bg-blue-50/50 dark:bg-blue-950/10")}
                  />
                ))}

                {/* Posts */}
                <div className="absolute inset-0 p-1 overflow-hidden">
                  {posts
                    .filter((post) => isSameDay(parseISO(post.scheduledFor), day))
                    .map((post) => {
                      // Calculate position based on time
                      const [hours, minutes] = post.scheduledTime.split(":").map(Number)
                      const top = (hours - 7 + minutes / 60) * 80 // 80px per hour

                      return (
                        <div key={post.id} className="absolute left-1 right-1" style={{ top: `${top}px` }}>
                          <CalendarPostItem post={post} onClick={() => setSelectedPost(post)} compact />
                        </div>
                      )
                    })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {selectedPost && (
        <PostDetailsDialog post={selectedPost} open={!!selectedPost} onOpenChange={() => setSelectedPost(null)} />
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { format, parseISO, isSameDay, addHours, startOfDay } from "date-fns"
import { CalendarPostItem } from "@/components/schedule/calendar-post-item"
import { PostDetailsDialog } from "@/components/schedule/post-details-dialog"
import type { ScheduledPost } from "@/data/mock-scheduled-posts"

interface CalendarDayViewProps {
  currentDate: Date
  posts: ScheduledPost[]
}

export function CalendarDayView({ currentDate, posts }: CalendarDayViewProps) {
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null)

  // Create time slots for each hour from 7 AM to 9 PM
  const timeSlots = Array.from({ length: 15 }, (_, i) => addHours(startOfDay(currentDate), i + 7))

  // Get posts for this day
  const dayPosts = posts.filter((post) => isSameDay(parseISO(post.scheduledFor), currentDate))

  return (
    <div className="flex h-[calc(100vh-250px)] min-h-[600px]">
      {/* Time column */}
      <div className="w-20 border-r">
        {timeSlots.map((time) => (
          <div key={time.toString()} className="h-20 border-b p-1 text-xs text-right pr-2 text-muted-foreground">
            {format(time, "h a")}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 relative">
        {/* Time slot backgrounds */}
        {timeSlots.map((time) => (
          <div key={time.toString()} className="h-20 border-b w-full" />
        ))}

        {/* Posts */}
        <div className="absolute inset-0 p-2 overflow-hidden">
          {dayPosts.map((post) => {
            // Calculate position based on time
            const [hours, minutes] = post.scheduledTime.split(":").map(Number)
            const top = (hours - 7 + minutes / 60) * 80 // 80px per hour

            return (
              <div key={post.id} className="absolute left-2 right-2" style={{ top: `${top}px` }}>
                <CalendarPostItem post={post} onClick={() => setSelectedPost(post)} expanded />
              </div>
            )
          })}

          {dayPosts.length === 0 && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No posts scheduled for this day
            </div>
          )}
        </div>
      </div>

      {selectedPost && (
        <PostDetailsDialog post={selectedPost} open={!!selectedPost} onOpenChange={() => setSelectedPost(null)} />
      )}
    </div>
  )
}

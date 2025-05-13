"use client"

import { useState } from "react"
import { format, addMonths, subMonths } from "date-fns"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDayView } from "@/components/schedule/calendar-day-view"
import { CalendarWeekView } from "@/components/schedule/calendar-week-view"
import { CalendarMonthView } from "@/components/schedule/calendar-month-view"
import { PostScheduleDialog, type ScheduleSettings } from "@/components/posts/post-schedule-dialog"
import { mockScheduledPosts } from "@/data/mock-scheduled-posts"

export function ScheduleCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week" | "day">("month")

  const handlePrevious = () => {
    if (view === "month") {
      setCurrentDate(subMonths(currentDate, 1))
    } else if (view === "week") {
      setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000))
    } else {
      setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000))
    }
  }

  const handleNext = () => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, 1))
    } else if (view === "week") {
      setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000))
    } else {
      setCurrentDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000))
    }
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleSchedule = (settings: ScheduleSettings) => {
    // In a real app, you would save this to the backend
    console.log("Post scheduled with settings:", settings)
  }

  return (
    <Card className="col-span-4">
      <CardContent className="p-0">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tabs value={view} onValueChange={(v) => setView(v as "month" | "week" | "day")}>
              <TabsList>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="day">Day</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleToday}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={handlePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <span className="font-medium mx-2">
              {view === "month"
                ? format(currentDate, "MMMM yyyy")
                : view === "week"
                  ? `Week of ${format(currentDate, "MMM d, yyyy")}`
                  : format(currentDate, "EEEE, MMMM d, yyyy")}
            </span>
            <PostScheduleDialog
              onSchedule={handleSchedule}
              trigger={
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Post
                </Button>
              }
            />
          </div>
        </div>

        {view === "month" && <CalendarMonthView currentDate={currentDate} posts={mockScheduledPosts} />}
        {view === "week" && <CalendarWeekView currentDate={currentDate} posts={mockScheduledPosts} />}
        {view === "day" && <CalendarDayView currentDate={currentDate} posts={mockScheduledPosts} />}
      </CardContent>
    </Card>
  )
}

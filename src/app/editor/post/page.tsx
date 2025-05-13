"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Settings } from "lucide-react"
import Link from "next/link"
import { TipTapEditor } from "@/components/editor/tiptap-editor"
import { PostScheduleDialog, type ScheduleSettings } from "@/components/posts/post-schedule-dialog"
import { ScheduleIndicator } from "@/components/posts/schedule-indicator"

export default function LongFormPostPage() {
  const [content, setContent] = useState("")
  const [status, setStatus] = useState("Draft")
  const [scheduleSettings, setScheduleSettings] = useState<ScheduleSettings | null>(null)

  const handleSchedule = (settings: ScheduleSettings) => {
    setScheduleSettings(settings)
    setStatus("Scheduled")
    // In a real app, you would save this to the backend
    console.log("Post scheduled with settings:", settings)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/posts">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${status === "Draft" ? "bg-yellow-500" : status === "Scheduled" ? "bg-blue-500" : "bg-green-500"}`}
              ></div>
              <span className="text-sm font-medium">{status}</span>
              {scheduleSettings && <ScheduleIndicator settings={scheduleSettings} className="ml-2" />}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Preview
            </Button>
            <PostScheduleDialog onSchedule={handleSchedule} postType="long-form" />
            <Button size="sm">{scheduleSettings ? "Update Schedule" : "Publish Now"}</Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <TipTapEditor content={content} onChange={setContent} />
      </main>

      <footer className="border-t">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
                <path d="M12 8v4l3 3" />
              </svg>
            </Button>
            <Button variant="ghost" size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </Button>
          </div>
          <Button variant="ghost" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </footer>
    </div>
  )
}

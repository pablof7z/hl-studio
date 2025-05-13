"use client"

import { Button } from "@/components/ui/button"
import { Command, ImageIcon, MessageSquare, Share2, X } from "lucide-react"

interface ThreadTipsProps {
  onClose: () => void
}

export function ThreadTips({ onClose }: ThreadTipsProps) {
  return (
    <div className="relative border-t p-4">
      <div className="mx-auto max-w-2xl rounded-lg bg-muted p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Tips to get started</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-2">
            <Command className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <p>
                Press <kbd className="rounded border px-1 text-xs">⌘</kbd>{" "}
                <kbd className="rounded border px-1 text-xs">↵</kbd> or add 2 empty lines to continue your thread
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <ImageIcon className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <p>Drop videos, images & GIFs in the editor</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MessageSquare className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <p>Tag your threads by clicking the # button in the top right corner</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Share2 className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <p>Share your drafts to get feedback</p>
            </div>
          </div>
        </div>

        <div className="mt-3 text-right">
          <Button variant="outline" size="sm" onClick={onClose}>
            Got it
          </Button>
        </div>
      </div>
    </div>
  )
}

"use client"

import { format, parseISO } from "date-fns"
import { FileText, MessageSquare, Calendar, Clock, Edit, Trash2, Copy, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PostScheduleDialog, type ScheduleSettings } from "@/components/posts/post-schedule-dialog"
import type { ScheduledPost } from "@/data/mock-scheduled-posts"

interface PostDetailsDialogProps {
  post: ScheduledPost
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PostDetailsDialog({ post, open, onOpenChange }: PostDetailsDialogProps) {
  const handleReschedule = (settings: ScheduleSettings) => {
    // In a real app, you would update the post with the new schedule
    console.log("Post rescheduled with settings:", settings)
    onOpenChange(false)
  }

  const handleDelete = () => {
    // In a real app, you would delete the post
    console.log("Post deleted:", post.id)
    onOpenChange(false)
  }

  const handleDuplicate = () => {
    // In a real app, you would duplicate the post
    console.log("Post duplicated:", post.id)
    onOpenChange(false)
  }

  const handleEdit = () => {
    // In a real app, you would navigate to the edit page
    console.log("Edit post:", post.id)
    onOpenChange(false)
  }

  const TypeIcon = post.type === "long-form" ? FileText : MessageSquare

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <TypeIcon className="h-5 w-5" />
            <DialogTitle>{post.title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Badge variant="outline">{post.type === "long-form" ? "Long-form Post" : "Thread"}</Badge>
            <Badge variant="outline" className="capitalize">
              {post.audienceType} subscribers
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{format(parseISO(post.scheduledFor), "EEEE, MMMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {post.scheduledTime} ({post.timezone})
              </span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Distribution</h4>
            <div className="flex flex-wrap gap-2">
              {post.distribution.email && <Badge variant="secondary">Email</Badge>}
              {post.distribution.twitter && <Badge variant="secondary">Twitter</Badge>}
              {post.distribution.linkedin && <Badge variant="secondary">LinkedIn</Badge>}
              {post.distribution.facebook && <Badge variant="secondary">Facebook</Badge>}
              {!post.distribution.email &&
                !post.distribution.twitter &&
                !post.distribution.linkedin &&
                !post.distribution.facebook && (
                  <span className="text-sm text-muted-foreground">No distribution channels selected</span>
                )}
            </div>
          </div>

          {post.excerpt && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Excerpt</h4>
                <p className="text-sm text-muted-foreground">{post.excerpt}</p>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleDuplicate}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <PostScheduleDialog
              onSchedule={handleReschedule}
              initialSettings={{
                date: parseISO(post.scheduledFor),
                time: post.scheduledTime,
                timezone: post.timezone,
                audienceType: post.audienceType,
                sendEmail: post.distribution.email,
                socialShare: {
                  twitter: post.distribution.twitter,
                  linkedin: post.distribution.linkedin,
                  facebook: post.distribution.facebook,
                },
              }}
              trigger={<Button size="sm">Reschedule</Button>}
            />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

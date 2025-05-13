"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

export interface ScheduleSettings {
  date: Date | undefined
  time: string
  timezone: string
  sendEmail: boolean
  socialShare: {
    twitter: boolean
    linkedin: boolean
    facebook: boolean
  }
  audienceType: "all" | "paid" | "free"
}

interface PostScheduleDialogProps {
  onSchedule: (settings: ScheduleSettings) => void
  initialSettings?: Partial<ScheduleSettings>
  trigger?: React.ReactNode
  postType?: "thread" | "long-form"
}

export function PostScheduleDialog({
  onSchedule,
  initialSettings,
  trigger,
  postType = "long-form",
}: PostScheduleDialogProps) {
  const [open, setOpen] = useState(false)
  const [settings, setSettings] = useState<ScheduleSettings>({
    date: initialSettings?.date || new Date(),
    time: initialSettings?.time || "09:00",
    timezone: initialSettings?.timezone || "America/New_York",
    sendEmail: initialSettings?.sendEmail ?? true,
    socialShare: initialSettings?.socialShare || {
      twitter: true,
      linkedin: false,
      facebook: false,
    },
    audienceType: initialSettings?.audienceType || "all",
  })

  const handleSchedule = () => {
    onSchedule(settings)
    setOpen(false)
  }

  const timezones = [
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
    { value: "Europe/Paris", label: "Central European Time (CET)" },
    { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
    { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
  ]

  const timeOptions = [
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            Schedule
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule {postType === "thread" ? "Thread" : "Post"}</DialogTitle>
          <DialogDescription>
            Choose when to publish your {postType === "thread" ? "thread" : "post"} and configure additional options.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Publication Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !settings.date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {settings.date ? format(settings.date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={settings.date}
                    onSelect={(date) => setSettings({ ...settings, date })}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Publication Time</Label>
              <Select value={settings.time} onValueChange={(time) => setSettings({ ...settings, time })}>
                <SelectTrigger id="time">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select value={settings.timezone} onValueChange={(timezone) => setSettings({ ...settings, timezone })}>
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Audience</Label>
            <RadioGroup
              value={settings.audienceType}
              onValueChange={(value) => setSettings({ ...settings, audienceType: value as "all" | "paid" | "free" })}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All subscribers</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paid" id="paid" />
                <Label htmlFor="paid">Paid subscribers only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="free" id="free" />
                <Label htmlFor="free">Free subscribers only</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid gap-4">
            <Label>Distribution Options</Label>
            <div className="flex items-center justify-between">
              <Label htmlFor="send-email" className="cursor-pointer">
                Send email to subscribers
              </Label>
              <Switch
                id="send-email"
                checked={settings.sendEmail}
                onCheckedChange={(checked) => setSettings({ ...settings, sendEmail: checked })}
              />
            </div>
            <div className="space-y-2">
              <Label>Share to social media</Label>
              <div className="flex items-center justify-between">
                <Label htmlFor="twitter" className="cursor-pointer">
                  Twitter
                </Label>
                <Switch
                  id="twitter"
                  checked={settings.socialShare.twitter}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      socialShare: { ...settings.socialShare, twitter: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="linkedin" className="cursor-pointer">
                  LinkedIn
                </Label>
                <Switch
                  id="linkedin"
                  checked={settings.socialShare.linkedin}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      socialShare: { ...settings.socialShare, linkedin: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="facebook" className="cursor-pointer">
                  Facebook
                </Label>
                <Switch
                  id="facebook"
                  checked={settings.socialShare.facebook}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      socialShare: { ...settings.socialShare, facebook: checked },
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSchedule}>
            <Check className="mr-2 h-4 w-4" />
            Schedule {postType === "thread" ? "Thread" : "Post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

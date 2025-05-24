"use client"

import { useState } from "react"
import { format, addMinutes, addHours, addDays, isBefore } from "date-fns"
import { Clock, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

export type TimeOption = {
  label: string
  value: Date | null
  custom?: boolean
}

interface TimeSelectProps {
  value?: Date | null
  onChange?: (date: Date | null) => void
  className?: string
  defaultText?: string
}

export function TimeSelector({ value, onChange, className, defaultText = "just now" }: TimeSelectProps) {
  const [customDate, setCustomDate] = useState<Date | null>(new Date())
  const [customTime, setCustomTime] = useState("12:00")
  const [open, setOpen] = useState(false)

  const now = new Date()

  const quickTimeOptions: TimeOption[] = [
    { label: defaultText, value: null },
    { label: "In 30 minutes", value: addMinutes(now, 30) },
    { label: "In 1 hour", value: addHours(now, 1) },
    { label: "In 3 hours", value: addHours(now, 3) },
    { label: "Tomorrow", value: addDays(now, 1) },
    { label: "In 3 days", value: addDays(now, 3) },
    { label: "In a week", value: addDays(now, 7) },
  ]

  const handleSelectTime = (option: TimeOption) => {
    if (option.custom) {
      return // Don't close Dialog for custom option
    }

    setOpen(false)

    if (onChange) {
      onChange(option.value)
    }
  }

  const handleCustomDateTimeSubmit = () => {
    if (!customDate) return

    const [hours, minutes] = customTime.split(":").map(Number)
    const dateWithTime = new Date(customDate)
    dateWithTime.setHours(hours, minutes)

    if (isBefore(dateWithTime, now)) {
      return // Don't allow dates in the past
    }

    setOpen(false)

    if (onChange) {
      onChange(dateWithTime)
    }
  }

  const getTimeDisplay = () => {
    if (!value) return defaultText

    const isToday = new Date().toDateString() === value.toDateString()
    const isTomorrow = addDays(new Date(), 1).toDateString() === value.toDateString()

    if (isToday) {
      return `Today at ${format(value, "h:mm a")}`
    } else if (isTomorrow) {
      return `Tomorrow at ${format(value, "h:mm a")}`
    } else {
      return format(value, "MMM d, yyyy 'at' h:mm a")
    }
  }

  // Generate time options for the custom time selector (hourly)
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i
    return `${hour.toString().padStart(2, "0")}:00`
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center gap-1 px-2 py-1 h-auto text-sm font-normal",
            value ? "text-foreground" : "text-muted-foreground",
            "hover:bg-accent hover:text-accent-foreground rounded-md transition-colors",
            className,
          )}
        >
          <Clock className="h-3.5 w-3.5" />
          <span>{getTimeDisplay()}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[550px] p-0">
        <div className="flex">
          {/* Quick options on the left */}
          <div className="w-[200px] border-r">
            <Command>
              <CommandList>
                <CommandGroup>
                  {quickTimeOptions.map((option, index) => (
                    <CommandItem
                      key={index}
                      onSelect={() => handleSelectTime(option)}
                      className={cn("flex items-center gap-2 px-2 py-1.5", option.custom && "border-t mt-1 pt-2")}
                    >
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>

          {/* Calendar and time selection on the right */}
          <div className="p-3 flex-1">
            <div className="space-y-4">
              {/* Calendar */}
              <div>
                <CalendarComponent
                  mode="single"
                  selected={customDate || undefined}
                  onSelect={(date) => setCustomDate(date || null)}
                  disabled={(date) => isBefore(date, new Date())}
                  className="rounded-md border"
                />
              </div>

              {/* Time selection */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Time</label>
                <Select value={customTime} onValueChange={setCustomTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {format(
                          new Date().setHours(Number.parseInt(time.split(":")[0]), Number.parseInt(time.split(":")[1])),
                          "h:mm a",
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full" onClick={handleCustomDateTimeSubmit} disabled={!customDate}>
                Set Time
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

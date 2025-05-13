"use client"
import { format, addMonths, subMonths } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CalendarControlsProps {
  currentDate: Date
  setCurrentDate: (date: Date) => void
}

export function CalendarControls({ currentDate, setCurrentDate }: CalendarControlsProps) {
  const handlePrevious = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const handleNext = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  return (
    <div className="flex items-center justify-between p-4">
      <Button variant="outline" size="icon" onClick={handlePrevious}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="font-medium">{format(currentDate, "MMMM yyyy")}</span>
      <Button variant="outline" size="icon" onClick={handleNext}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

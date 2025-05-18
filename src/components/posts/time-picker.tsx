"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TimePickerDemoProps {
    value?: string // Expected format "HH:mm"
    onChange?: (value: string) => void
}

export function TimePickerDemo({ value: initialValue = "09:00", onChange }: TimePickerDemoProps) {
    const [time, setTime] = useState(initialValue)

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTime(e.target.value)
        if (onChange) {
            onChange(e.target.value)
        }
    }

    // Basic time validation (can be improved)
    const isValidTime = /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);

    return (
        <div className="space-y-1">
            <Label htmlFor="time-picker" className="text-sm">Time</Label>
            <Input
                id="time-picker"
                type="time"
                value={time}
                onChange={handleTimeChange}
                className={`w-full sm:w-auto ${!isValidTime ? "border-red-500" : ""}`}
            />
            {!isValidTime && <p className="text-xs text-red-500">Please enter a valid time (HH:MM).</p>}
        </div>
    )
}
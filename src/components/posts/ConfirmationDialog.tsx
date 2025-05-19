import type React from "react"
import { useState, useEffect } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TimePickerDemo } from "./time-picker"; // Correct relative path

export interface ConfirmationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    hasPaidPlan?: boolean;
    onPublish: () => void;
    onSchedule: (publishAt: Date) => void;
    children?: React.ReactNode;
}

export function ConfirmationDialog({
    open,
    onOpenChange,
    hasPaidPlan = false,
    onPublish,
    onSchedule,
    children,
}: ConfirmationDialogProps) {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [time, setTime] = useState<string>("09:00");
    const [isScheduled, setIsScheduled] = useState(false);
    const [audience, setAudience] = useState<"all" | "subscribers">("all");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setDate(undefined);
            setTime("09:00");
            setIsScheduled(false);
            setAudience("all");
        }
    }, [open]);

    const handleSubmit = async () => {
        setError(null);
        // The parent should provide the up-to-date data via the children component's state
        // so we just call onPublish/onSchedule or backendSchedule with the latest props
        // For now, we assume the parent will handle the data
        if (isScheduled) {
            if (date && time) {
                const scheduleDateTime = new Date(date);
                const [hours, minutes] = time.split(':').map(Number);
                scheduleDateTime.setHours(hours, minutes, 0, 0);
                if (onSchedule)
                    onSchedule(scheduleDateTime);
            } else {
                setError("Date and time must be set for scheduling.");
                return;
            }
        }
            onPublish();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-xl">Publish Article</DialogTitle>
                </DialogHeader>
                {error && (
                    <div className="mb-2 text-sm text-red-600">{error}</div>
                )}
                <div className="grid gap-6 py-4">
                    {children}
                    <Separator />

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Publishing Options</h3>

                        <div className="space-y-2">
                            <RadioGroup
                                value={isScheduled ? "schedule" : "publish"}
                                onValueChange={(value) => setIsScheduled(value === "schedule")}
                                className="flex flex-col space-y-1"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="publish" id="publish" />
                                    <Label htmlFor="publish" className="font-normal">
                                        Publish now
                                    </Label>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <RadioGroupItem value="schedule" id="schedule" className="mt-1" />
                                    <div className="space-y-2">
                                        <Label htmlFor="schedule" className="font-normal">
                                            Schedule for later
                                        </Label>

                                        {isScheduled && (
                                            <div className="flex flex-col sm:flex-row gap-2">
                                                <Dialog>
                                                    <DialogTrigger>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full sm:w-[240px] justify-start text-left font-normal"
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="w-auto p-0 z-[500]">
                                                        <Calendar
                                                            mode="single"
                                                            selected={date}
                                                            onSelect={setDate}
                                                            initialFocus
                                                            disabled={(d) => d < new Date(new Date().setDate(new Date().getDate() -1))} // Allow today
                                                        />
                                                    </DialogContent>
                                                </Dialog>
                                                <TimePickerDemo value={time} onChange={setTime} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* <div className="space-y-2 pt-2">
                            <Label className="text-sm font-medium">Target Audience</Label>
                            <RadioGroup value={audience} onValueChange={(value) => setAudience(value as "all" | "subscribers")} className="flex flex-col space-y-1">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="all" id="all" />
                                    <Label htmlFor="all" className="font-normal">
                                        All audience
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {!hasPaidPlan ? (
                                        <div className="flex items-center space-x-2 opacity-60">
                                            <RadioGroupItem value="subscribers" id="subscribers" disabled />
                                            <Label htmlFor="subscribers" className="font-normal">
                                                Subscribers only <Badge variant="outline" className="ml-1 text-xs">Upgrade</Badge>
                                            </Label>
                                        </div>
                                    ) : (
                                        <>
                                            <RadioGroupItem value="subscribers" id="subscribers" />
                                            <Label htmlFor="subscribers" className="font-normal">
                                                Subscribers only
                                            </Label>
                                        </>
                                    )}
                                </div>
                            </RadioGroup>

                            {!hasPaidPlan && (
                                <div className="mt-2 rounded-md bg-muted p-3">
                                    <p className="text-sm">
                                        Want to publish exclusive content for paying subscribers?{" "}
                                        <a href="#" className="font-medium text-primary hover:underline">
                                            Create a paid subscription plan
                                        </a>
                                    </p>
                                </div>
                            )}
                        </div> */}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                    >
                        {(isScheduled ? "Schedule" : "Publish") + " Article"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
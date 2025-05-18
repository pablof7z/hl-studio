"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { CalendarIcon, Edit, ImageIcon, X } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { TimePickerDemo } from "./time-picker" // Correct relative path
import { useAccountStore } from "@/domains/account/stores/accountStore"
import { useNDKCurrentPubkey } from "@nostr-dev-kit/ndk-hooks"
import UserAvatar from "@/features/nostr/components/user/UserAvatar"
import UserName from "@/features/nostr/components/user/UserName"

export interface ConfirmationDialogCallbackData {
    title: string;
    summary: string;
    tags: string[];
    heroImage: string; // base64 or URL
    audience: "all" | "subscribers";
    scheduledAt?: Date; // Present if scheduling
}

export interface ConfirmationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData: {
        title: string;
        summary: string;
        tags: string[];
        heroImage: string;
        publicationName: string;
    };
    hasPaidPlan?: boolean;
    onPublish: (data: ConfirmationDialogCallbackData) => void;
    onSchedule: (data: ConfirmationDialogCallbackData) => void;
}

export function ConfirmationDialog({
    open,
    onOpenChange,
    initialData,
    hasPaidPlan = false,
    onPublish,
    onSchedule,
}: ConfirmationDialogProps) {
    const [currentTitle, setCurrentTitle] = useState(initialData.title)
    const [currentSummary, setCurrentSummary] = useState(initialData.summary)
    const [currentHeroImage, setCurrentHeroImage] = useState(initialData.heroImage)
    const [currentTags, setCurrentTags] = useState<string[]>(initialData.tags)
    const [newTag, setNewTag] = useState("")
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [time, setTime] = useState<string>("09:00") // For TimePickerDemo
    const [isScheduled, setIsScheduled] = useState(false)
    const [audience, setAudience] = useState<"all" | "subscribers">("all")
    const [isEditing, setIsEditing] = useState(false)
    const currentPubkey = useNDKCurrentPubkey();

    useEffect(() => {
        if (open) {
            setCurrentTitle(initialData.title);
            setCurrentSummary(initialData.summary);
            setCurrentHeroImage(initialData.heroImage);
            setCurrentTags(initialData.tags);
            // Reset scheduling and UI states
            setDate(undefined);
            setTime("09:00");
            setIsScheduled(false);
            setAudience("all");
            setIsEditing(false);
        }
    }, [open, initialData]);

    const handleAddTag = () => {
        if (newTag && !currentTags.includes(newTag)) {
            setCurrentTags([...currentTags, newTag])
            setNewTag("")
        }
    }

    const handleRemoveTag = (tagToRemove: string) => {
        setCurrentTags(currentTags.filter((tag) => tag !== tagToRemove))
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                setCurrentHeroImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = () => {
        const callbackData: Omit<ConfirmationDialogCallbackData, "scheduledAt"> = {
            title: currentTitle,
            summary: currentSummary,
            tags: currentTags,
            heroImage: currentHeroImage,
            audience: audience,
        };

        if (isScheduled) {
            if (date && time) {
                const scheduleDateTime = new Date(date);
                const [hours, minutes] = time.split(':').map(Number);
                scheduleDateTime.setHours(hours, minutes, 0, 0);
                onSchedule({ ...callbackData, scheduledAt: scheduleDateTime });
            } else {
                // TODO: Add user-facing error handling (e.g., a toast notification)
                console.error("Date and time must be set for scheduling.");
                return; // Prevent closing dialog or submitting
            }
        } else {
            onPublish(callbackData); // scheduledAt will be undefined implicitly
        }
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-xl">Publish Article</DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">Social Preview</h3>
                            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                                {isEditing ? (
                                    "Done"
                                ) : (
                                    <>
                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                    </>
                                )}
                            </Button>
                        </div>

                        <Card className="overflow-hidden border shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <UserAvatar pubkey={currentPubkey} size={"xs"} />
                                            <span className="text-sm font-medium"><UserName pubkey={currentPubkey} /></span>
                                        </div>

                                        {isEditing ? (
                                            <>
                                                <Input
                                                    value={currentTitle}
                                                    onChange={(e) => setCurrentTitle(e.target.value)}
                                                    placeholder="Article title"
                                                    className="border-0 p-0 h-auto font-semibold text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                                />
                                                <Textarea
                                                    value={currentSummary}
                                                    onChange={(e) => setCurrentSummary(e.target.value)}
                                                    placeholder="Brief summary of your article"
                                                    className="border-0 p-0 h-auto min-h-0 text-sm text-muted-foreground resize-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                                    rows={2}
                                                />
                                                <div className="flex flex-wrap gap-1 pt-1">
                                                    {currentTags.map((tag) => (
                                                        <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0 gap-1">
                                                            {tag}
                                                            <button onClick={() => handleRemoveTag(tag)} className="ml-1 h-3 w-3 rounded-full flex items-center justify-center">
                                                                <X className="h-2 w-2" />
                                                            </button>
                                                        </Badge>
                                                    ))}
                                                    <div className="inline-flex">
                                                        <Input
                                                            value={newTag}
                                                            onChange={(e) => setNewTag(e.target.value)}
                                                            placeholder="+ Add tag"
                                                            className="border-0 p-0 h-auto w-20 text-xs shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") {
                                                                    e.preventDefault()
                                                                    handleAddTag()
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <h3 className="font-semibold text-base line-clamp-2">{currentTitle || "Untitled"}</h3>
                                                <p className="text-sm text-muted-foreground line-clamp-2">{currentSummary || "No summary"}</p>
                                                <div className="flex flex-wrap gap-1 pt-1">
                                                    {currentTags.length === 0 && (
                                                        <span className="text-xs text-muted-foreground italic">
                                                            No tags
                                                        </span>
                                                    )}
                                                    {currentTags.map((tag) => (
                                                        <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                                        {currentHeroImage ? (
                                            <>
                                                <Image
                                                    src={currentHeroImage || "/placeholder.svg"} // placeholder if src is empty
                                                    alt="Hero image"
                                                    width={80}
                                                    height={80}
                                                    className="object-cover w-full h-full"
                                                />
                                                {isEditing && (
                                                    <Label
                                                        htmlFor="image-upload"
                                                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                                                    >
                                                        <div className="text-white text-xs font-medium">Replace</div>
                                                    </Label>
                                                )}
                                            </>
                                        ) : (
                                            <Label
                                                htmlFor="image-upload"
                                                className={`flex h-full w-full items-center justify-center ${isEditing ? "cursor-pointer" : "cursor-default"}`}
                                            >
                                                <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                                            </Label>
                                        )}
                                        {isEditing && (
                                            <Input
                                                id="image-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageUpload}
                                            />
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

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
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full sm:w-[240px] justify-start text-left font-normal"
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={date}
                                                            onSelect={setDate}
                                                            initialFocus
                                                            disabled={(d) => d < new Date(new Date().setDate(new Date().getDate() -1))} // Allow today
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <TimePickerDemo value={time} onChange={setTime} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-2 pt-2">
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
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>{isScheduled ? "Schedule" : "Publish"} Article</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
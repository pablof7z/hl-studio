"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { format } from "date-fns" // Import format
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { NostrEditor } from "@/components/editor/nostr-editor"
import { ScheduleIndicator, type ScheduleIndicatorSettings } from "@/components/posts/schedule-indicator"
import { useEvent } from "@nostr-dev-kit/ndk-hooks"
import { NDKKind, NDKArticle } from "@nostr-dev-kit/ndk"
import { SettingsModal, useEditorStore, useEditorPublish } from "@/features/long-form-editor"
import { ConfirmationDialog, type ConfirmationDialogCallbackData } from "@/components/posts/ConfirmationDialog" // Updated import


export default function LongFormPostPage() {
    const searchParams = useSearchParams();
    const encodedId = searchParams.get("id") || undefined;

    // Get store state and actions
    const {
        content,
        setContent,
        title,
        setTitle,
        summary,
        setSummary,
        tags,
        setTags,
        setPublishedAt,
    } = useEditorStore();

    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

    // Get publishing functions
    const { publishArticle, saveAsDraft } = useEditorPublish();

    // Status state
    const [status, setStatus] = useState("Draft");
    const [scheduledDateTime, setScheduledDateTime] = useState<Date | null>(null);


    // Use the useEvent hook from ndk-hooks to fetch the event by encoded ID
    const event = useEvent(encodedId || false);

    useEffect(() => {
        if (event) {
            if (event.kind === NDKKind.Article) {
                const article = NDKArticle.from(event);
                setContent(article.content ?? "");
                setTitle(article.title ?? "");
                setSummary(article.summary ?? "");
                setTags(article.getMatchingTags("t").map(t => t[1]) || []);
                if (article.published_at) {
                    setPublishedAt(new Date(article.published_at * 1000));
                    setStatus("Published") // Or determine based on date
                }
            } else {
                setContent(event.content ?? "");
            }
        }
    }, [event, setContent, setTitle, setSummary, setTags, setPublishedAt]);

    const handlePublishOrSchedule = (data: ConfirmationDialogCallbackData) => {
        // Update the editor store with the latest from the dialog
        setTitle(data.title);
        setSummary(data.summary);
        setTags(data.tags);
        // Note: heroImage and audience are not directly in editorStore yet.
        // For now, we'll use them for the publish/schedule action.

        if (data.scheduledAt) {
            // This is a schedule action
            setPublishedAt(data.scheduledAt); // Update store with scheduled date
            console.log("Scheduling post with data:", data);
            // In a real app, you would call a backend or NDK function to schedule
            // For now, we simulate by updating status and storing schedule time
            setStatus("Scheduled");
            setScheduledDateTime(data.scheduledAt);
            // Potentially call a specific schedule function from useEditorPublish if it exists
            // e.g., scheduleArticle({ ...data });
        } else {
            // This is a publish now action
            setPublishedAt(new Date()); // Update store with current date
            console.log("Publishing post with data:", data);
            publishArticle(); // This will use the latest state from useEditorStore
            setStatus("Published");
            setScheduledDateTime(null);
        }
        setIsConfirmDialogOpen(false);
    };


    const handleSaveAsDraftInternal = () => {
        // Ensure store is up-to-date if there were unsaved changes in local component state
        // (though in this setup, NostrEditor directly updates the store via onChange)
        const article = saveAsDraft();
        if (article) {
            console.log("Draft saved:", article);
            setStatus("Draft");
        }
    };

    const dialogInitialData = {
        title: title || "",
        summary: summary || "",
        tags: tags || [],
        heroImage: "", // Placeholder - this should come from store or a default
        publicationName: "My Nostr Publication", // Placeholder
    };

    // Determine schedule settings for the ScheduleIndicator
    const scheduleIndicatorSettings: ScheduleIndicatorSettings | null =
        status === "Scheduled" && scheduledDateTime
            ? {
                date: scheduledDateTime,
                time: format(scheduledDateTime, "HH:mm"),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                // Add placeholder/default values for missing properties
                sendEmail: true, // Default or from a relevant state
                audienceType: "all", // Default or from a relevant state
                socialShare: { // Placeholder for socialShare
                    twitter: false,
                    linkedin: false,
                    facebook: false,
                },
            }
            : null;

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
                            {scheduleIndicatorSettings && <ScheduleIndicator settings={scheduleIndicatorSettings} className="ml-2" />}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            Preview
                        </Button>
                        <Button size="sm" onClick={() => setIsConfirmDialogOpen(true)}>
                            {status === "Scheduled" && scheduledDateTime ? "Update Schedule" : "Publish"}
                        </Button>
                    </div>
                </div>
            </header>

            <ConfirmationDialog
                open={isConfirmDialogOpen}
                onOpenChange={setIsConfirmDialogOpen}
                initialData={dialogInitialData}
                onPublish={handlePublishOrSchedule} // Same handler for both, logic inside differentiates
                onSchedule={handlePublishOrSchedule} // Same handler for both
                // hasPaidPlan can be wired up later if needed
            />

            <main className="flex-1">
                <NostrEditor event={event} onChange={setContent} />
            </main>

            <footer className="border-t">
                <div className="container mx-auto flex items-center justify-between h-14 px-4">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={handleSaveAsDraftInternal}>
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
                    
                    {/* Use our new SettingsModal component */}
                    <SettingsModal />
                </div>
            </footer>
        </div>
    );
}

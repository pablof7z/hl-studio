import { NostrEventCardProps } from ".";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";  
import { NostrEventCardHeader } from "./NostrEventCardHeader";
import { NostrEventCardFooter } from "./NostrEventCardFooter";
import { TextEvent } from "@/features/nostr/components/event/TextEvent";

export function TextEventCard({ event }: NostrEventCardProps) {
    return (
        <Card>
            <CardHeader>
                <NostrEventCardHeader event={event} />
            </CardHeader>
            <CardContent>
                <TextEvent event={event} />
            </CardContent>
            <CardFooter>
                <NostrEventCardFooter event={event} />
            </CardFooter>
        </Card>
    );
}
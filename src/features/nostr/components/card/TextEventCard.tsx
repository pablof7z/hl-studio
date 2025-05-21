import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TextEvent } from '@/features/nostr/components/event/TextEvent';
import { NostrEventCardProps } from '.';
import { NostrEventCardFooter } from './NostrEventCardFooter';
import { NostrEventCardHeader } from './NostrEventCardHeader';

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

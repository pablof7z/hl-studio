import { SubscribersContent } from '@/components/subscribers/subscribers-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Subscribers | Highlighter',
    description: 'Manage your subscribers',
};

export default function SubscribersPage() {
    return (
        <div className="container mx-auto py-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Subscribers</h1>
                <p className="text-muted-foreground mt-2">Manage your subscribers and import from other platforms.</p>
            </div>
            <SubscribersContent />
        </div>
    );
}

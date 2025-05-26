'use client';

import { NostrEditor } from '@/components/editor/nostr-editor';
import { ConfirmationDialog } from '@/components/posts/ConfirmationDialog';
import { getConfirmationButtonText } from '@/components/posts/utils/getConfirmationButtonText';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SettingsModal, useEditorStore } from '@/features/long-form-editor';
import { PostStatus } from '@/features/long-form-editor/components/PostStatus';
import { SocialPreview } from '@/features/long-form-editor/components/SocialPreview';
import { NDKSchedule } from '@/features/schedules/event/schedule';
import { NDKArticle, NDKDraft, NDKKind, useEvent, useNDK, useNDKCurrentPubkey } from '@nostr-dev-kit/ndk-hooks';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LongFormPostPage() {
    const searchParams = useSearchParams();
    const encodedId = searchParams.get('id') || undefined;
    const [article, setArticle] = useState<NDKArticle | null>(null);
    const {
        setContent,
        title,
        setTitle,
        restoreFromEvent,
        publishAt,
        setPublishAt,
        post,
        proposalCounterparty,
        author,
    } = useEditorStore();

    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const currentPubkey = useNDKCurrentPubkey();
    const isProposal = !!(author && author.pubkey !== currentPubkey);
    const isScheduled = publishAt !== null;

    // Use the useEvent hook from ndk-hooks to fetch the event by encoded ID
    const event = useEvent(encodedId || false, { wrap: true });

    useEffect(() => {
        if (event instanceof NDKArticle) {
            setArticle(event);
        } else if (event?.kind === NDKKind.DVMEventSchedule) {
            const scheduleEvent = NDKSchedule.from(event);
            scheduleEvent.getEvent().then((article) => {
                console.log('restoring with schedule', article?.inspect);
                if (article) {
                    const _article = NDKArticle.from(article);
                    restoreFromEvent(_article);
                    setArticle(_article);
                }
            });
        } else if (event?.kind === NDKKind.Draft || event?.kind === NDKKind.DraftCheckpoint) {
            const draft = NDKDraft.from(event);
            draft.getEvent().then((article) => {
                console.log('restoring with draft', article?.inspect);
                if (article) {
                    const _article = NDKArticle.from(article);
                    restoreFromEvent(_article, draft);
                    setArticle(_article);
                }
            });
        }
    }, [event]);

    const { ndk } = useNDK();

    const handlePublish = async () => {
        if (!ndk) throw new Error('NDK is not initialized');

        post(ndk);
        
        setIsConfirmDialogOpen(false);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b">
                <div className="mx-auto flex items-center justify-between h-14 px-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div className="flex items-center gap-2">
                            <PostStatus />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* TODO Replace with a ProposalIndicator! */}
                        {proposalCounterparty && (
                            <span className="text-xs text-muted-foreground mr-2">
                                Proposal for {proposalCounterparty.profile?.name || proposalCounterparty.npub.slice(0, 8)}...
                            </span>
                        )}
                        <Button variant="outline" size="sm">
                            Preview
                        </Button>
                        <Button size="sm" className="px-6" onClick={() => setIsConfirmDialogOpen(true)}>
                            Continue
                        </Button>
                    </div>
                </div>
            </header>

            <ConfirmationDialog
                open={isConfirmDialogOpen}
                onOpenChange={setIsConfirmDialogOpen}
                onSubmit={handlePublish}
                publishAt={publishAt}
                setPublishAt={setPublishAt}
                buttonText={getConfirmationButtonText({
                    isProposal,
                    isScheduled,
                })}
            >
                <SocialPreview />
            </ConfirmationDialog>

            <main className="flex-1">
                <NostrEditor event={article} onChange={setContent}>
                    <Input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-0 border-0 !outline-none !ring-0 longform-content--title"
                    />
                </NostrEditor>
            </main>

            <footer className="border-t fixed bottom-0 bg-background w-full">
                <div className="flex items-center justify-between h-14 px-4">
                    <div className="flex items-center gap-2">
                    </div>

                    <SettingsModal />
                </div>
            </footer>
        </div>
    );
}

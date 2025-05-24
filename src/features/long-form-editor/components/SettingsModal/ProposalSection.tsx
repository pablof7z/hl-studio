'use client';

import { Button } from '@/components/ui/button';
import { MentionModal } from '@/features/mention';
import { MentionEntity } from '@/features/mention/types';
import { useEditorStore } from '../../stores';
import { useCallback, useState } from 'react';
import { NDKUser } from '@nostr-dev-kit/ndk';
import UserAvatar from '@/features/nostr/components/user/UserAvatar';
import { useProfileValue } from '@nostr-dev-kit/ndk-hooks';
import { X } from 'lucide-react';

// Recipient display component to properly use hooks
function RecipientDisplay({ user }: { user: NDKUser }) {
    const profile = useProfileValue(user.pubkey);
    
    return (
        <div className="flex items-center gap-2">
            <UserAvatar pubkey={user.pubkey} size="sm" />
            <div>
                <p className="font-medium">{profile?.name || 'Unknown'}</p>
                <p className="text-xs text-muted-foreground">{user.npub.slice(0, 10)}...</p>
            </div>
        </div>
    );
}

export function ProposalSection() {
    const { author, setAuthor, proposalCounterparty, setProposalCounterparty, clearProposalCounterparty } = useEditorStore();
    const [mentionModalOpen, setMentionModalOpen] = useState(false);

    // Handle user selection from MentionModal
    const handleUserSelect = useCallback(
        (entity: MentionEntity) => {
            if (entity.type === 'user' && entity.user) {
                setProposalCounterparty(entity.user);
                setAuthor(entity.user);
                setMentionModalOpen(false);
            }
        },
        [setProposalCounterparty]
    );

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Proposal Mode</h3>
                <p className="text-sm text-muted-foreground">
                    Select a different person to propose publishing this article.
                </p>
            </div>

            <div className="space-y-4">
                {proposalCounterparty ? (
                    <div className="flex items-center justify-between border rounded-md p-3">
                        <RecipientDisplay user={proposalCounterparty} />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={clearProposalCounterparty}
                            className="h-8 w-8"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="text-sm text-muted-foreground">No counterparty selected</div>
                )}

                <Button
                    onClick={() => setMentionModalOpen(true)}
                    className="w-full"
                    variant={proposalCounterparty ? "outline" : "default"}
                >
                    {proposalCounterparty ? "Change author" : "Select author"}
                </Button>
            </div>

            <MentionModal
                open={mentionModalOpen}
                onSelect={handleUserSelect}
                onClose={() => setMentionModalOpen(false)}
            />
        </div>
    );
}